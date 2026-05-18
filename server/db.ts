import { eq, and, desc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vendors, ratings, photos, Vendor, Rating } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (process.env.OWNER_OPEN_ID && user.openId === process.env.OWNER_OPEN_ID) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Vendor queries
export async function getApprovedVendors() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(vendors).where(eq(vendors.isApproved, true)).orderBy(desc(vendors.safetyScore));
}

export async function getVendorById(vendorId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(vendors).where(eq(vendors.id, vendorId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPendingVendors() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(vendors).where(eq(vendors.isApproved, false)).orderBy(desc(vendors.createdAt));
}

export async function createVendor(data: {
  name: string;
  description?: string;
  foodType?: string;
  address?: string;
  latitude: number;
  longitude: number;
  submittedBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(vendors).values({
    name: data.name,
    description: data.description,
    foodType: data.foodType,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    submittedBy: data.submittedBy,
    safetyScore: 0,
    grade: 'D',
    isApproved: false,
  });

  return result;
}

export async function approveVendor(vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(vendors).set({ isApproved: true }).where(eq(vendors.id, vendorId));
}

export async function rejectVendor(vendorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(vendors).where(eq(vendors.id, vendorId));
}

// Rating queries
export async function submitRating(data: {
  vendorId: number;
  userId: number;
  hygiene: number;
  foodHandling: number;
  waterSource: number;
  wasteDisposal: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(ratings).values({
    vendorId: data.vendorId,
    userId: data.userId,
    hygiene: data.hygiene,
    foodHandling: data.foodHandling,
    waterSource: data.waterSource,
    wasteDisposal: data.wasteDisposal,
    comment: data.comment,
  });

  // Update vendor safety score
  await updateVendorScore(data.vendorId);

  return result;
}

export async function getRatingsByVendor(vendorId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(ratings).where(eq(ratings.vendorId, vendorId));
}

export async function updateVendorScore(vendorId: number) {
  const db = await getDb();
  if (!db) return;

  const vendorRatings = await db.select().from(ratings).where(eq(ratings.vendorId, vendorId));

  if (vendorRatings.length === 0) {
    await db.update(vendors).set({ safetyScore: 0, grade: 'D' }).where(eq(vendors.id, vendorId));
    return;
  }

  const avgHygiene = vendorRatings.reduce((sum, r) => sum + r.hygiene, 0) / vendorRatings.length;
  const avgFoodHandling = vendorRatings.reduce((sum, r) => sum + r.foodHandling, 0) / vendorRatings.length;
  const avgWaterSource = vendorRatings.reduce((sum, r) => sum + r.waterSource, 0) / vendorRatings.length;
  const avgWasteDisposal = vendorRatings.reduce((sum, r) => sum + r.wasteDisposal, 0) / vendorRatings.length;

  const safetyScore = (avgHygiene * 0.35 + avgFoodHandling * 0.30 + avgWaterSource * 0.20 + avgWasteDisposal * 0.15) * 20;

  let grade: string;
  if (safetyScore >= 80) grade = 'A';
  else if (safetyScore >= 60) grade = 'B';
  else if (safetyScore >= 40) grade = 'C';
  else grade = 'D';

  await db.update(vendors).set({ safetyScore: Math.round(safetyScore * 10) / 10, grade }).where(eq(vendors.id, vendorId));
}

// Photo queries
export async function getPhotosByVendor(vendorId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(photos).where(eq(photos.vendorId, vendorId));
}

export async function uploadPhoto(data: {
  vendorId: number;
  url: string;
  fileKey: string;
  uploadedBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(photos).values({
    vendorId: data.vendorId,
    url: data.url,
    fileKey: data.fileKey,
    uploadedBy: data.uploadedBy,
  });
}

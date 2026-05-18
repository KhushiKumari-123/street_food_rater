import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "./procedures";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
  }),

  vendors: router({
    list: publicProcedure
      .input(z.object({
        grade: z.string().optional(),
        foodType: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const vendors = await db.getApprovedVendors();
        
        let filtered = vendors;
        if (input?.grade) {
          filtered = filtered.filter(v => v.grade === input.grade);
        }
        if (input?.foodType) {
          filtered = filtered.filter(v => v.foodType === input.foodType);
        }
        if (input?.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter(v => 
            v.name.toLowerCase().includes(search) ||
            v.description?.toLowerCase().includes(search)
          );
        }
        
        return filtered;
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const vendor = await db.getVendorById(input);
        if (!vendor) throw new TRPCError({ code: "NOT_FOUND" });
        
        const ratings = await db.getRatingsByVendor(input);
        const photos = await db.getPhotosByVendor(input);
        
        return { vendor, ratings, photos };
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        foodType: z.string().optional(),
        address: z.string().optional(),
        latitude: z.number(),
        longitude: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createVendor({
          ...input,
          submittedBy: ctx.user.id,
        });
        return result;
      }),

    approve: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.approveVendor(input);
        return { success: true };
      }),

    reject: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.rejectVendor(input);
        return { success: true };
      }),
  }),

  ratings: router({
    submit: protectedProcedure
      .input(z.object({
        vendorId: z.number(),
        hygiene: z.number().min(1).max(5),
        foodHandling: z.number().min(1).max(5),
        waterSource: z.number().min(1).max(5),
        wasteDisposal: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.submitRating({
          ...input,
          userId: ctx.user.id,
        });
        return result;
      }),

    getByVendor: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRatingsByVendor(input);
      }),
  }),

  photos: router({
    upload: protectedProcedure
      .input(z.object({
        vendorId: z.number(),
        url: z.string(),
        fileKey: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.uploadPhoto({
          ...input,
          uploadedBy: ctx.user.id,
        });
      }),

    getByVendor: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getPhotosByVendor(input);
      }),
  }),

  admin: router({
    getPendingVendors: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getPendingVendors();
      }),
  }),
});

export type AppRouter = typeof appRouter;

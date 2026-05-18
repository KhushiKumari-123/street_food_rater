import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TrpcContext = {
  user?: {
    id: number;
    openId: string;
    email?: string | null;
    name?: string | null;
    role: "user" | "admin";
  };
};

export const createContext = async (
  opts: CreateExpressContextOptions
): Promise<TrpcContext> => {
  // Get user from request (this would be set by middleware)
  const user = (opts.req as any).user;
  return { user };
};

const t = initTRPC.context<TrpcContext>().create();

export const publicProcedure = t.procedure;
export const router = t.router;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

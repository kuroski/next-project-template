import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context } from "@/server/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isProtectedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isProtectedMiddleware);

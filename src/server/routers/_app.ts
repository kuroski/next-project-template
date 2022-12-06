import healthRouter from "@/server/routers/health";
import { router } from "@/server/trpc";

export const appRouter = router({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;

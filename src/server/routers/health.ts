import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";

const healthRoute = router({
  ping: publicProcedure.query<string>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("Pong"), 1000);
      })
  ),
  pong: publicProcedure.input(z.object({ name: z.string() })).mutation<string>(
    (data) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(`Ping ${data.input.name}`), 1000);
      })
  ),
});

export default healthRoute;

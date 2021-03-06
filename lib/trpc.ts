import { createReactQueryHooks } from "@trpc/react";
import { inferProcedureInput } from "@trpc/server";
import superjson from "superjson";

import { AppRouter } from "@/server/routers/_app";

export const trpc = createReactQueryHooks<AppRouter>();

export const transformer = superjson;

export type TQuery = keyof AppRouter["_def"]["queries"];

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
];

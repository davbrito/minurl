import { createTRPCClient, httpBatchLink } from "@trpc/client";
import {
    createTRPCContext,
    createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import type { AppRouter } from "../worker/rpc/router";
import { queryClient } from "./query";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

const searchParams = new URLSearchParams(window.location.search);
const apiKey = searchParams.get("key") || searchParams.get("api_key") || "";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: new URL("/rpc", window.location.origin).href,
      headers: {
        "x-api-key": apiKey,
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

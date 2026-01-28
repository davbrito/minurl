import "./styles.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Links, Meta, Outlet, Scripts } from "react-router";
import { serverContext } from "../lib/contexts";
import type { Route } from "./+types/root";
import AppLayout from "./components/app-layout";
import { getQueryClient } from "./query";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>MinURL - Shorten your URLs with ease</title>
        <Links />
        <Meta />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function loader(ctx: Route.LoaderArgs) {
  const auth = ctx.context.get(serverContext);
  return {
    isAuthenticated: auth.isAuthenticated
  };
}

export default function App({
  loaderData: { isAuthenticated }
}: Route.ComponentProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout isAuthenticated={isAuthenticated}>
        <Outlet />
      </AppLayout>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

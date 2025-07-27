import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Router } from "wouter";
import App from "./App";
import { queryClient } from "./query";
import { trpcClient, TRPCProvider } from "./rpc";

const root = document.getElementById("root")!;

const reactRoot = createRoot(root);

reactRoot.render(
  <QueryClientProvider client={queryClient}>
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <Router>
        <App />
        <Toaster position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </TRPCProvider>
  </QueryClientProvider>
);

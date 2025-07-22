import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
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
      </Router>
    </TRPCProvider>
  </QueryClientProvider>,
);

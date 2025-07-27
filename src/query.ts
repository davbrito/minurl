import { QueryCache, MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface QueryMeta {
  skipErrorToast?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: QueryMeta;
    mutationMeta: QueryMeta;
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.skipErrorToast) return;
      toast.error(error?.message || "Ocurrió un error en la consulta.");
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error?.message || "Ocurrió un error en la acción.");
    }
  }),
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

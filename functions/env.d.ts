export interface Env {
  MinifiedUrls: KVNamespace;
}

declare global {
  const MinifiedUrls: KVNamespace;
}

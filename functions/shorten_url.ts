import { Env } from "./env";

const EXPIRATION_TIME_SEC = 60;

export const onRequest: PagesFunction<Env> = async (context) => {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const url = new URL(request.url);

  if (!url.searchParams.has("url")) {
    return new Response(
      JSON.stringify({
        error: "No url parameter provided",
      }),
      { status: 400 }
    );
  }

  const urlToShorten = url.searchParams.get("url");

  try {
    new URL(urlToShorten);
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "Invalid url parameter provided",
      }),
      { status: 400 }
    );
  }

  const id = await storeUrl(MinifiedUrls, urlToShorten);

  const response = JSON.stringify({ url: `/x/${id}` });

  return new Response(response);
};

async function storeUrl(kv: KVNamespace, url: string) {
  let id = await kv.get(url);

  if (id !== null) {
    return id;
  }

  id = crypto.randomUUID();

  await Promise.all([
    kv.put(id, url, {
      expirationTtl: EXPIRATION_TIME_SEC,
    }),
    kv.put(url, id, {
      expirationTtl: EXPIRATION_TIME_SEC,
    }),
  ]);

  return id;
}

const EXPIRATION_TIME_SEC = 10000;

export const onRequestPost: PagesFunction<Env> = async (context) => {
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

  const formData = await request.formData();

  if (!url.searchParams.has("url") && !formData.has("url")) {
    return new Response(
      JSON.stringify({
        error: "No url provided",
      }),
      { status: 400 }
    );
  }

  const urlToShorten =
    url.searchParams.get("url") ?? (formData.get("url") as string);

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

  const id = await storeUrl(env.MinifiedUrls, urlToShorten);

  const minifiedUrl = `/x/${id}`;

  if (url.searchParams.has("redirect")) {
    const redirectUrl = new URL(url.searchParams.get("redirect"));
    redirectUrl.searchParams.set("minified_url", minifiedUrl);
    redirectUrl.searchParams.set("url", urlToShorten);
    return Response.redirect(redirectUrl.toString(), 301);
  }

  const response = JSON.stringify({ url: minifiedUrl });

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

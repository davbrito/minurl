export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params, waitUntil, next, data } = context;

  const id = params.id as string;

  if (!id) {
    return new Response("Invalid request. Please provide an id in the url.", {
      status: 400,
    });
  }

  const fullUrl = await env.MinifiedUrls.get(id);

  if (fullUrl === null) {
    return new Response(
      JSON.stringify({
        params,
        error: "Invalid request. Please provide a valid id in the url.",
      }),
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({
      params,
      url: fullUrl,
    }),
    { status: 200 }
  );
};

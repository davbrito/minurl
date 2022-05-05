export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, params } = context;

  const id = params.id as string;

  if (!id) {
    return new Response("Invalid request. Please provide an id in the url.", {
      status: 400,
    });
  }

  const fullUrl = await env.MinifiedUrls.get(id);

  if (fullUrl === null) {
    return new Response(
      JSON.stringify("Invalid request. Please provide a valid id in the url."),
      { status: 400 }
    );
  }

  return Response.redirect(fullUrl, 301);
};

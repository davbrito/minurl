import { serverContext } from "lib/contexts";
import { getUrlWithMetadata } from "lib/services/shortener";
import { removeCreatedUrlId } from "worker/session";
import { removeUrl } from "worker/shortener";
import Preview from "../components/preview";
import type { Route } from "./+types/minified-id";
import { redirect } from "react-router";

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const { env } = context.get(serverContext);
  const kv = env.MinifiedUrls;
  const data = await getUrlWithMetadata(kv, params.id);
  const baseUrl = new URL(request.url).origin;
  return { id: params.id, data, baseUrl };
}

export async function action({ params, context, request }: Route.ActionArgs) {
  const { env, session } = context.get(serverContext);
  const kv = env.MinifiedUrls;
  const { id } = params;

  if (request.method === "DELETE") {
    console.log("Deleting URL with id:", id);
    await removeUrl(kv, id);
    removeCreatedUrlId(session, id);

    const referrer = request.headers.get("Referer")!;
    const referrerUrl = new URL(referrer);
    const requestUrl = new URL(request.url);

    if (referrerUrl.origin !== requestUrl.origin) {
      throw redirect("/");
    }

    throw redirect(`${referrerUrl.pathname}${referrerUrl.search}`);
  }

  throw new Response("Method not allowed", { status: 405 });
}

export default function Minified({ loaderData }: Route.ComponentProps) {
  const { id, data, baseUrl } = loaderData;
  return (
    <div className="grow p-6">
      <Preview id={id} data={data} baseUrl={baseUrl} />
    </div>
  );
}

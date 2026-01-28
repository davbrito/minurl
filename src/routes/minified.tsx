import { serverContext } from "lib/contexts";
import { getUrlWithMetadata } from "lib/services/shortener";
import Preview from "../components/preview";
import type { Route } from "./+types/minified";

export async function loader({ request, context }: Route.LoaderArgs) {
  const kv = context.get(serverContext).env.MinifiedUrls;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    throw new Response("Missing id parameter", { status: 400 });
  }

  const data = await getUrlWithMetadata(kv, id);
  const baseUrl = url.origin;
  return { id, data, baseUrl };
}

export default function Minified({ loaderData }: Route.ComponentProps) {
  const { id, data, baseUrl } = loaderData;
  return (
    <div className="grow p-6">
      <Preview id={id} data={data} baseUrl={baseUrl} />
    </div>
  );
}

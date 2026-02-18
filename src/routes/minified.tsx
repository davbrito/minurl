import { getMinifiedPath } from "@features/shortener/helpers";
import { findLink } from "@features/shortener/links";
import Preview from "../components/preview";
import type { Route } from "./+types/minified";

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    throw new Response("Missing id parameter", { status: 400 });
  }

  const data = await findLink(context, id);
  const baseUrl = url.origin;
  const shortUrl = new URL(getMinifiedPath(id), baseUrl).href;
  return { id, data, baseUrl, shortUrl };
}

export default function Minified({ loaderData }: Route.ComponentProps) {
  const { id, data, shortUrl } = loaderData;
  return (
    <div className="grow p-6">
      <Preview id={id} data={data} shortUrl={shortUrl} />
    </div>
  );
}

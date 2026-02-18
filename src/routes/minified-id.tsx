import { getMinifiedPath } from "@features/shortener/helpers";
import { deleteLink, findLink } from "@features/shortener/links";
import { redirect } from "react-router";
import Preview from "../components/preview";
import type { Route } from "./+types/minified-id";

export async function loader({ params, context, request }: Route.LoaderArgs) {
  const data = await findLink(context, params.id);
  const baseUrl = new URL(request.url).origin;
  const shortUrl = `${baseUrl}${getMinifiedPath(params.id)}`;
  return { id: params.id, data, shortUrl };
}

export async function action({ params, context, request }: Route.ActionArgs) {
  const { id } = params;

  if (request.method === "DELETE") {
    await deleteLink(context, id);

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
  const { id, data, shortUrl } = loaderData;
  return (
    <div className="grow p-6">
      <Preview id={id} data={data} shortUrl={shortUrl} />
    </div>
  );
}

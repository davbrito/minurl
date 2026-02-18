import { serverContext } from "@core/contexts";
import { listLinks } from "@features/shortener/links";
import Inspect from "../components/inspect";
import type { Route } from "./+types/_internal";

const DEFAULT_PAGE_SIZE = 10;

export async function loader({ context, request }: Route.LoaderArgs) {
  const { isAuthenticated } = context.get(serverContext);

  if (!isAuthenticated) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let limit =
    Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;
  limit = Math.min(limit, 50); // Max limit of 50
  const after = searchParams.get("after") || undefined;
  const before = searchParams.get("before") || undefined;

  const { links, meta } = await listLinks(context, { after, before, limit });

  return { links, meta, baseUrl: url.origin };
}

export default function Internal({ loaderData }: Route.ComponentProps) {
  return (
    <Inspect
      links={loaderData.links}
      pagination={loaderData.meta}
      baseUrl={loaderData.baseUrl}
    />
  );
}

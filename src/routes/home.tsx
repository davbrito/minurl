import { getMinifiedPath, getPreviewPath } from "@features/shortener/helpers";
import { createLink, listLinksBySlugs } from "@features/shortener/links";
import { serverContext } from "lib/contexts";
import { Form, redirect } from "react-router";
import CreatedUrls from "src/components/created-urls";
import MinifyUrlForm from "src/components/minify-url-form";
import type { Route } from "./+types/home";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { session } = context.get(serverContext);

  const ids = session.get("createdUrlIds") || [];
  const baseUrl = new URL(request.url).origin;

  const links = await listLinksBySlugs(context, ids);

  return {
    urls: links.map((link) => ({
      ...link,
      id: link.slug,
      minifiedUrl: `${baseUrl}${getMinifiedPath(link.slug)}`
    }))
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const data = await request.formData();

  const urlVal = data.get("url");

  const url = URL.parse(String(urlVal));

  if (!url) {
    return {
      formError: "Please enter a valid URL."
    };
  }

  const result = await createLink(context, url.href);

  throw redirect(getPreviewPath(result.slug));
}

function Home(props: Route.ComponentProps) {
  const { urls } = props.loaderData;
  return (
    <div className="flex size-full min-h-0 min-w-0 grow flex-col items-center justify-between gap-8 px-6 py-10 sm:justify-evenly sm:px-12">
      <MinifyUrlForm error={props.actionData?.formError} />
      <Form method="delete">
        <CreatedUrls urls={urls} />
      </Form>
    </div>
  );
}

export default Home;

import { serverContext } from "lib/contexts";
import { shortenUrl } from "lib/services/shortener";
import { Form, redirect } from "react-router";
import CreatedUrls from "src/components/created-urls";
import MinifyUrlForm from "src/components/minify-url-form";
import { getPreviewPath, getUrls } from "worker/shortener";
import type { Route } from "./+types/home";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { env, session } = context.get(serverContext);
  const kv = env.MinifiedUrls;

  const ids = session.get("createdUrlIds") || [];
  const urls = await getUrls(kv, ids, new URL(request.url).origin);

  return { urls };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { env, session, executionCtx } = context.get(serverContext);
  const kv = env.MinifiedUrls;

  const data = await request.formData();

  const urlVal = data.get("url");

  const url = URL.parse(String(urlVal));

  if (!url) {
    return {
      formError: "Please enter a valid URL."
    };
  }
  const result = await shortenUrl(kv, session, executionCtx, url.href);

  throw redirect(getPreviewPath(result.id));
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

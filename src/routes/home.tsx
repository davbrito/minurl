import MinifyUrlForm from "@components/minify-url-form";
import RecentActivity from "@components/recent-activity";
import { getMinifiedPath, getPreviewPath } from "@features/shortener/helpers";
import { createLink, listLinksBySession } from "@features/shortener/links";
import { redirect } from "react-router";
import type { Route } from "./+types/home";

export async function loader({ context, request }: Route.LoaderArgs) {
  const baseUrl = new URL(request.url).origin;

  const links = await listLinksBySession(context, 5);

  return {
    urls: links.map((link) => ({
      ...link,
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
    <>
      <section className="px-4 pt-14 pb-14 sm:px-8 sm:pt-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Shorten Your Links,
            <span className="block text-blue-600">Expand Your Reach</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            A simple tool to track, manage, and brand your URLs. Transform long,
            ugly links into short, memorable ones in seconds.
          </p>

          <div className="mt-8 w-full">
            <MinifyUrlForm error={props.actionData?.formError} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              ● No credit card required
            </span>
            <span className="flex items-center gap-2">
              ● Free custom aliases
            </span>
          </div>
        </div>
      </section>

      <RecentActivity urls={urls} />

      <section id="features" className="px-4 py-14 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-2 text-xl font-bold text-slate-900">
              Advanced Analytics
            </h4>
            <p className="text-sm text-slate-600">
              Track clicks, geographic data, and referrer sources in real-time.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-2 text-xl font-bold text-slate-900">
              Custom Aliases
            </h4>
            <p className="text-sm text-slate-600">
              Customize your short links to match your brand identity.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-2 text-xl font-bold text-slate-900">
              QR Code Generation
            </h4>
            <p className="text-sm text-slate-600">
              Automatically generate QR codes for every shortened link.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default Home;

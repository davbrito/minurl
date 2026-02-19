import { getPreviewPath } from "@features/shortener/helpers";
import type { Link as LinkType } from "@features/shortener/links";
import { Form, Link } from "react-router";

interface RecentActivityItem extends LinkType {
  minifiedUrl: string;
}

function getCompactUrl(value: string) {
  const compact = value.replace(/^https?:\/\//, "");
  return compact.length > 42 ? `${compact.slice(0, 39)}...` : compact;
}

function RecentActivity({ urls }: { urls: RecentActivityItem[] }) {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-slate-900">Recent Activity</h3>
          <a
            href="#"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View all history
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-5 py-3">Original Link</th>
                <th className="px-5 py-3">Short Link</th>
                <th className="px-5 py-3">Clicks</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-slate-500"
                    colSpan={4}
                  >
                    No recent activity yet.
                  </td>
                </tr>
              ) : (
                urls.map((item) => (
                  <tr
                    key={item.slug}
                    className="border-t border-slate-100 text-slate-700"
                  >
                    <td className="px-5 py-4">
                      <Link
                        viewTransition
                        to={getPreviewPath(item.slug)}
                        className="font-medium text-slate-800 hover:text-blue-600"
                      >
                        {getCompactUrl(item.url)}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={item.minifiedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {getCompactUrl(item.minifiedUrl)}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {item.visitCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Form method="delete" action={`/minified/${item.slug}`}>
                        <button
                          type="submit"
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Delete
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default RecentActivity;

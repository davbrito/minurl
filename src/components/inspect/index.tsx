import type { UrlWithMetadata } from "lib/services/shortener";
import { FaExternalLinkAlt, FaEye, FaList } from "react-icons/fa";
import { Form, Link } from "react-router";
import { getMinifiedPath, getPreviewPath } from "../../../worker/shortener";
import RemoveButton from "../remove-button";

interface InspectProps {
  baseUrl: string;
  urls: UrlWithMetadata[];
  prevCursor?: string;
  cursor?: string;
  nextCursor?: string;
}

function Inspect({
  baseUrl,
  urls,
  prevCursor,
  nextCursor,
  cursor
}: InspectProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="p-2 text-lg font-semibold">
        <FaList className="inline text-sm" /> Minified URLs
      </h1>
      <ul className="grow">
        {urls.map((url) => {
          const minifiedUrl = getMinifiedPath(url.id);
          return (
            <li
              key={url.id}
              className="flex flex-row items-center p-3 odd:bg-zinc-100 even:bg-zinc-50"
            >
              <div className="flex grow flex-col gap-1">
                <a href={minifiedUrl} target="_blank" rel="noopener noreferrer">
                  {url.url}{" "}
                  <FaExternalLinkAlt className="inline align-baseline text-xs" />
                </a>
                <pre className="w-fit rounded bg-zinc-600 px-1 text-xs break-all text-white">
                  {baseUrl}
                  {minifiedUrl}
                </pre>
                <span className="text-sm text-slate-500">
                  Visitas: {url.visits ?? 0}
                </span>
              </div>

              <Link
                viewTransition
                to={getPreviewPath(url.id)}
                title="Ver"
                type="button"
                className={
                  "ml-2 grid place-items-center rounded-md p-1 text-blue-500 hover:bg-blue-100"
                }
              >
                <FaEye />
              </Link>
              <Form
                method="delete"
                action={`/minified/${url.id}`}
                className="contents"
                unstable_defaultShouldRevalidate
              >
                <RemoveButton type="submit" />
              </Form>
            </li>
          );
        })}
      </ul>
      <Pagination
        cursor={cursor}
        nextCursor={nextCursor}
        prevCursor={prevCursor}
      />
    </div>
  );
}

export default Inspect;

function Pagination({
  cursor,
  nextCursor,
  prevCursor
}: {
  cursor?: string;
  nextCursor?: string;
  prevCursor?: string;
}) {
  if (!nextCursor && !prevCursor) return null;
  return (
    <div className="mt-4 flex justify-center gap-2 p-3">
      {prevCursor || cursor ? (
        <Link
          className="button"
          to={`?cursor=${encodeURIComponent(prevCursor || "")}`}
        >
          {"Previous"}
        </Link>
      ) : null}
      {nextCursor ? (
        <Link
          className="button"
          to={`?cursor=${encodeURIComponent(nextCursor || "")}`}
        >
          {"Next"}
        </Link>
      ) : null}
    </div>
  );
}

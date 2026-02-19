import { getMinifiedPath, getPreviewPath } from "@features/shortener/helpers";
import type {
  Link as LinkType,
  PaginationMetadata
} from "@features/shortener/links";
import { FaExternalLinkAlt, FaEye, FaList } from "react-icons/fa";
import { Form, Link } from "react-router";
import RemoveButton from "../remove-button";

interface InspectProps {
  baseUrl: string;
  links: LinkType[];
  pagination: PaginationMetadata;
}

function Inspect({ baseUrl, links, pagination }: InspectProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="p-2 text-lg font-semibold">
        <FaList className="inline text-sm" /> Minified URLs
      </h1>
      <ul className="grow">
        {links.map((url) => {
          const minifiedUrl = getMinifiedPath(url.slug);
          return (
            <li
              key={url.slug}
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
                  Visitas: {url.visitCount}
                </span>
                <div className="text-sm text-slate-400">
                  <div>
                    Creado:{" "}
                    {url.createdAt
                      ? new Date(url.createdAt).toLocaleString()
                      : "—"}
                  </div>
                  <div>
                    Último click:{" "}
                    {url.lastClickedAt
                      ? new Date(url.lastClickedAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              <Link
                viewTransition
                to={getPreviewPath(url.slug)}
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
                action={`/minified/${url.slug}`}
                className="contents"
                unstable_defaultShouldRevalidate
              >
                <RemoveButton type="submit" />
              </Form>
            </li>
          );
        })}
      </ul>
      <Pagination {...pagination} />
    </div>
  );
}

export default Inspect;

function Pagination({
  startCursor,
  endCursor,
  hasNextPage,
  hasPreviousPage
}: PaginationMetadata) {
  if (!hasNextPage && !hasPreviousPage) return null;
  return (
    <div className="mt-4 flex justify-center gap-2 p-3">
      {hasPreviousPage ? (
        <Link
          className="button"
          to={`?before=${encodeURIComponent(startCursor || "")}`}
        >
          {"Previous"}
        </Link>
      ) : null}
      {hasNextPage ? (
        <Link
          className="button"
          to={`?after=${encodeURIComponent(endCursor || "")}`}
        >
          {"Next"}
        </Link>
      ) : null}
    </div>
  );
}

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { FaExternalLinkAlt, FaList } from "react-icons/fa";
import { getMinifiedPath } from "../../../worker/shortener";
import { trpc } from "../../rpc";
import RemoveButton from "../remove-button";

function Inspect() {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteQuery(
    trpc.listUrls.infiniteQueryOptions(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const remove = useMutation(
    trpc.deleteUrl.mutationOptions({
      onSuccess: () => {
        refetch();
      }
    })
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="p-2 text-lg font-semibold">
        <FaList className="inline text-sm" /> Minified URLs
      </h1>
      <ul className="grow">
        {Iterator.from(data.pages)
          .flatMap((page) => page.urls)
          .map((url) => {
            const minifiedUrl = getMinifiedPath(url.id);
            return (
              <li
                key={url.id}
                className="flex flex-row items-center justify-between p-3 odd:bg-zinc-100 even:bg-zinc-50"
              >
                <div className="flex flex-col gap-1">
                  <a
                    href={minifiedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.url}{" "}
                    <FaExternalLinkAlt className="inline align-baseline text-xs" />
                  </a>
                  <pre className="w-fit rounded bg-zinc-600 px-1 text-xs break-all text-white">
                    {window.location.origin}
                    {minifiedUrl}
                  </pre>
                  <span className="text-sm text-slate-500">
                    Visitas: {url.visits ?? 0}
                  </span>
                </div>
                <RemoveButton
                  onClick={() => remove.mutate({ id: url.id })}
                  disabled={remove.isPending}
                  loading={remove.isPending && url.id === remove.variables?.id}
                />
              </li>
            );
          })
          .toArray()}
      </ul>
      <Pagination
        onMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        loadingMore={isFetchingNextPage}
      />
    </div>
  );
}

export default Inspect;

function Pagination({
  onMore,
  hasMore,
  loadingMore
}: {
  onMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}) {
  return (
    <div className="mt-4 flex justify-center p-3">
      <button
        type="button"
        className="button"
        onClick={onMore}
        disabled={!hasMore || loadingMore}
      >
        {loadingMore ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}

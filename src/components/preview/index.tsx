import { skipToken, useQuery } from "@tanstack/react-query";
import useSearchParams from "../../hooks/useSearchParams";
import { trpc } from "../../rpc";

const Preview = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const { data, isLoading, isError, error } = useQuery(
    trpc.getUrlById.queryOptions(id ? { id } : skipToken)
  );

  if (!id) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>Error: Missing URL id.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="mr-3 inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></span>
        <span className="text-lg text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>Error: {error?.message || "No se pudo cargar la URL."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-1 rounded-lg border border-gray-200 bg-white p-6 shadow">
      <p>
        <strong className="text-gray-700">Original:</strong>{" "}
        <a
          href={data.url}
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline"
        >
          {data.url}
        </a>
      </p>
      <p>
        <strong className="text-gray-700">Minified:</strong>{" "}
        <a
          href={`/x/${data.id}`}
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline"
        >
          {new URL(`/x/${data.id}`, window.location.href).href}
        </a>
      </p>
      <p>
        <strong className="text-gray-700">Visitas:</strong> {data.visits}
      </p>
    </div>
  );
};

export default Preview;

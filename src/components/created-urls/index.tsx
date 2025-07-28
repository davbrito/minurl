import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "../../rpc";
import { AiOutlineHistory, AiOutlineDelete } from "react-icons/ai";
import { getMinifiedPath, getPreviewPath } from "../../../worker/shortener";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";

function CreatedUrls() {
  const [show, setShow] = useState(true);

  const { data, isSuccess, isError, error, refetch } = useQuery(
    trpc.myUrls.queryOptions()
  );
  const mutation = useMutation(
    trpc.deleteUrl.mutationOptions({
      onSuccess: () => {
        refetch();
      }
    })
  );

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error: {error?.message || "No se pudo cargar las URLs."}
      </div>
    );
  }

  if (!isSuccess || !data.urls || data.urls.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl min-w-0 rounded-xl border border-gray-300 bg-white p-1 shadow-[2px_2px_0_var(--color-gray-300)]">
      <div className="flex items-center gap-1 p-2">
        <AiOutlineHistory size={14} className="text-gray-500" />
        <h2 className="text-xs font-semibold text-gray-700">Historial</h2>

        <button
          type="button"
          title={show ? "Ocultar" : "Mostrar"}
          className="ml-auto aspect-square rounded-md p-1 text-xs text-gray-500 hover:bg-gray-100"
          onClick={() => {
            setShow((prev) => !prev);
          }}
        >
          {show ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <ul id="history-list" className="max-h-44 overflow-y-auto" hidden={!show}>
        {data.urls.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border-t border-gray-100 p-1"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <a
                href={getPreviewPath(item.id)}
                className="min-w-0 truncate text-blue-600 hover:underline"
              >
                {item.url}
              </a>
              <div className="truncate text-xs text-gray-500">
                {new URL(getMinifiedPath(item.id), window.location.origin).href}
              </div>
            </div>
            <button
              className="ml-2 rounded-md p-1 hover:bg-red-100"
              title="Eliminar"
              onClick={() => mutation.mutate({ id: item.id })}
              disabled={mutation.isPending}
            >
              <AiOutlineDelete className="text-red-500" size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreatedUrls;

import { useState } from "react";
import { AiOutlineDelete, AiOutlineHistory } from "react-icons/ai";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import { getPreviewPath } from "@features/shortener/helpers";

interface CreatedUrlsProps {
  urls: { id: string; url: string; minifiedUrl: string }[] | null;
}

function CreatedUrls({ urls }: CreatedUrlsProps) {
  const [show, setShow] = useState(true);

  if (!urls || urls.length === 0) {
    return null;
  }

  return (
    <div className="mt-auto flex h-50 w-full max-w-130 min-w-0 flex-col items-center">
      <div className="flex min-h-0 w-full min-w-0 flex-col overflow-auto rounded-xl border border-gray-300 bg-white shadow-[2px_2px_0_var(--color-gray-300)]">
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
        <ul
          id="history-list"
          className="min-h-0 overflow-y-auto"
          hidden={!show}
        >
          {urls.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-t border-gray-100 px-2 py-1"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  viewTransition
                  to={getPreviewPath(item.id)}
                  className="min-w-0 truncate text-blue-600 hover:underline"
                >
                  {item.url}
                </Link>
                <div className="truncate text-xs text-gray-500">
                  {item.minifiedUrl}
                </div>
              </div>
              <button
                className="ml-2 rounded-md p-1 hover:bg-red-100"
                title="Eliminar"
                type="submit"
                name="id"
                value={item.id}
                formMethod="delete"
                formAction={`/minified/${item.id}`}
              >
                <AiOutlineDelete className="text-red-500" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreatedUrls;

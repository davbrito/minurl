import type { Link } from "@features/shortener/links";

interface PreviewProps {
  id?: string;
  data: Link | undefined;
  analytics?: any[];
  shortUrl: string;
}

function Preview({ id, data, shortUrl, analytics }: PreviewProps) {
  if (!id) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>Error: Missing URL id.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <p>No URL found for id: {id}</p>
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
          href={shortUrl}
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline"
        >
          {shortUrl}
        </a>
      </p>
      <p>
        <strong className="text-gray-700">Visitas:</strong> {data.visitCount}
      </p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700">Analíticas</h3>
        {analytics && analytics.length > 0 ? (
          <div className="mt-2 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-1">Hora</th>
                  <th className="pb-1">País</th>
                  <th className="pb-1">Ciudad</th>
                  <th className="pb-1">Dispositivo</th>
                  <th className="pb-1">Navegador</th>
                  <th className="pb-1">Referer</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((a: any) => (
                  <tr key={a.id} className="border-t">
                    <td className="py-1 text-gray-600">
                      {a.timestamp
                        ? new Date(a.timestamp).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-1 text-gray-600">{a.country ?? "—"}</td>
                    <td className="py-1 text-gray-600">{a.city ?? "—"}</td>
                    <td className="py-1 text-gray-600">{a.device ?? "—"}</td>
                    <td className="py-1 text-gray-600">{a.browser ?? "—"}</td>
                    <td className="py-1 break-all text-gray-600">
                      {a.referer ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No hay datos de analíticas.
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;

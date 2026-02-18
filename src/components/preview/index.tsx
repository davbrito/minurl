import type { Link } from "@features/shortener/links";
import { useSearchParams } from "react-router";

interface PreviewProps {
  id?: string;
  data: Link | undefined;
  shortUrl: string;
}

function Preview({ id: propId, data, shortUrl }: PreviewProps) {
  const [searchParams] = useSearchParams();

  const id = propId || searchParams.get("id");

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
    </div>
  );
}

export default Preview;

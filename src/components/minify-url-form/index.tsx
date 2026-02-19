import { Form } from "react-router";

function MinifyUrlForm({ error }: { error?: string }) {
  return (
    <Form method="post" className="w-full">
      <label htmlFor="url-input" className="sr-only">
        Paste your long link
      </label>
      <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:flex-row sm:items-center">
        <div className="flex min-w-0 grow items-center px-3 py-2">
          <span className="mr-2 text-slate-400">⛓</span>
          <input
            className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            required
            type="url"
            name="url"
            id="url-input"
            placeholder="Paste your long link here..."
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Shorten URL →
        </button>
      </div>

      {error ? <div className="mt-2 text-sm text-red-700">{error}</div> : null}
    </Form>
  );
}

export default MinifyUrlForm;

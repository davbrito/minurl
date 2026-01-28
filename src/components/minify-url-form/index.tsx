import { Form } from "react-router";

function MinifyUrlForm({ error }: { error?: string }) {
  return (
    <Form
      method="post"
      className={
        "flex w-full flex-col items-center gap-3 rounded-3xl border border-purple-300 bg-purple-200 p-3 sm:max-w-130 sm:p-6"
      }
      style={{
        boxShadow: "2px 2px 0 var(--color-purple-300) "
      }}
    >
      <label className="text-xl font-bold" htmlFor="url-input">
        Ingrese una url
      </label>
      <input
        className={
          "focus:ring-primary/50 focus:border-primary/80 w-full grow appearance-none rounded-md border border-zinc-300 bg-white/80 px-2 py-1 font-mono text-base inset-shadow-sm transition-shadow placeholder:text-zinc-400 focus:ring-3 focus:outline-none sm:text-xl"
        }
        required
        type="url"
        name="url"
        id="url-input"
        placeholder="https://en.wikipedia.org/wiki/URL_shortening"
      />
      {error ? (
        <div className="w-full text-sm text-red-700">{error}</div>
      ) : null}
      <button type="submit" className="button text-md ml-auto rounded-lg">
        Minify
      </button>
    </Form>
  );
}

export default MinifyUrlForm;

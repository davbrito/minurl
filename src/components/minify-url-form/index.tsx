import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { trpc } from "../../rpc";

const MinifyUrlForm = () => {
  const [, setLocation] = useLocation();
  const mutation = useMutation(
    trpc.shorten.mutationOptions({
      onSuccess: (data, variables) => {
        setLocation(
          `/minified?` +
            new URLSearchParams({
              minified_url: data.minifiedUrl,
              url: variables.url,
            }).toString(),
        );
      },
      onError: (error) => {
        alert(error.message);
      },
    }),
  );

  return (
    <div className="grid size-full min-h-0 min-w-0 grow place-items-center px-12">
      <form
        className={
          "flex w-full max-w-130 flex-col items-center gap-3 rounded-3xl border border-purple-300/50 bg-purple-200 p-6 shadow-md shadow-purple-600/20"
        }
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          mutation.mutate({
            url: formData.get("url") as string,
          });
        }}
      >
        <label className="text-xl font-bold" htmlFor="url-input">
          Ingrese una url
        </label>
        <input
          className={
            "focus:ring-primary/50 focus:border-primary/80 w-full grow appearance-none rounded-md border border-zinc-300 bg-white/80 px-2 py-1 font-mono text-xl inset-shadow-sm transition-shadow placeholder:text-zinc-400 focus:ring-3 focus:outline-none"
          }
          required
          type="url"
          name="url"
          id="url-input"
          placeholder="https://en.wikipedia.org/wiki/URL_shortening"
        />
        <button type="submit" className="button text-md ml-auto rounded-lg">
          Minify
        </button>
      </form>
    </div>
  );
};

export default MinifyUrlForm;

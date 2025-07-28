import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getPreviewPath } from "../../../worker/shortener";
import { trpc } from "../../rpc";
import CreatedUrls from "../created-urls";

const MinifyUrlForm = () => {
  const [, setLocation] = useLocation();
  const mutation = useMutation(
    trpc.shorten.mutationOptions({
      onSuccess: (data) => {
        setLocation(getPreviewPath(data.id));
      }
    })
  );

  return (
    <div className="flex size-full min-h-0 min-w-0 grow flex-col items-center justify-between gap-8 px-6 py-10 sm:justify-evenly sm:px-12">
      <form
        className={
          "flex w-full flex-col items-center gap-3 rounded-3xl border border-purple-300 bg-purple-200 p-3 sm:max-w-130 sm:p-6"
        }
        style={{
          boxShadow: "2px 2px 0 var(--color-purple-300) "
        }}
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          mutation.mutate({
            url: formData.get("url") as string
          });
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
        <button type="submit" className="button text-md ml-auto rounded-lg">
          Minify
        </button>
      </form>
      <CreatedUrls />
    </div>
  );
};

export default MinifyUrlForm;

import Header from "../header";

function AppLayout({
  children,
  isAuthenticated
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  return (
    <main className="flex min-h-full flex-col bg-slate-100">
      <Header isAuthenticated={isAuthenticated} />
      <div className="grow">{children}</div>
      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="grid size-5 place-items-center rounded bg-blue-600 text-[10px] text-white">
              ⛓
            </span>
            <img
              src="/favicon-32x32.png"
              alt="minurl logo"
              className="h-5 w-auto"
            />
            <span>minurl</span>
          </div>
          <div className="text-center text-xs text-slate-500 sm:text-right">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} David Brito. All rights reserved.
            </div>
            <div className="">
              Made with {"❤️"} by{" "}
              <a
                href="https://github.com/davbrito"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-900"
              >
                davbrito
              </a>
            </div>
            <div>
              Source code on{" "}
              <a
                href="https://github.com/davbrito/minurl"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-900"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default AppLayout;

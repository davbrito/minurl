import { FaBug } from "react-icons/fa";
import { Link } from "react-router";

function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="border-b border-slate-200 bg-white/95 px-4 py-3 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
        <Link viewTransition to="/" className="flex items-center gap-2">
          <img
            src="/favicon-32x32.png"
            alt="minurl logo"
            className="h-6 w-auto"
          />
          <h1 className="text-base font-semibold text-slate-900">minurl</h1>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-slate-900"
          >
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-slate-900">
            Pricing
          </a>
          <a
            href="#resources"
            className="transition-colors hover:text-slate-900"
          >
            Resources
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3 text-sm md:ml-8">
          <button
            type="button"
            className="text-slate-700 transition-colors hover:text-slate-900"
          >
            Login
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>

        {isAuthenticated ? (
          <Link
            viewTransition
            to="/_internal"
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
          >
            <FaBug className="mr-1 inline text-xs" /> Internal
          </Link>
        ) : null}
      </div>
    </header>
  );
}

export default Header;

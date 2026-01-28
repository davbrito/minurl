import { FaBug } from "react-icons/fa";
import { Link } from "react-router";

function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="flex items-center justify-between bg-neutral-300/30 p-3">
      <Link viewTransition to="/">
        <h1 className="">
          <span className="text-4xl font-bold text-slate-500">min</span>
          <span className="text-5xl font-bold text-slate-900 uppercase">
            url
          </span>
        </h1>
      </Link>
      {isAuthenticated ? (
        <Link
          viewTransition
          to="/_internal"
          className="rounded-md bg-neutral-200 px-2 py-1 font-bold"
        >
          <FaBug className="inline text-sm" /> Internal
        </Link>
      ) : null}
    </header>
  );
}

export default Header;

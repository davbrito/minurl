import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FaBug } from "react-icons/fa";
import { trpc } from "../../rpc";

const Header = () => {
  const { data: { isAuthenticated } = {} } = useQuery(
    trpc.isAuthenticated.queryOptions()
  );

  return (
    <header className="flex items-center justify-between bg-neutral-300/30 p-3">
      <Link href="/">
        <h1 className="">
          <span className="text-4xl font-bold text-slate-500">min</span>
          <span className="text-5xl font-bold text-slate-900 uppercase">
            url
          </span>
        </h1>
      </Link>
      {isAuthenticated ? (
        <Link
          href="/_internal"
          className="rounded-md bg-neutral-200 px-2 py-1 font-bold"
        >
          <FaBug className="inline text-sm" /> Internal
        </Link>
      ) : null}
    </header>
  );
};

export default Header;

import { Route } from "wouter";
import Header from "../components/header";
import MinifyUrlForm from "../components/minify-url-form";
import Preview from "../components/preview";
import styles from "./styles.module.css";
import Inspect from "../components/inspect";

function App() {
  return (
    <main className={styles.root}>
      <Header />
      <Route path="/">
        <MinifyUrlForm />
      </Route>
      <Route path="/minified">
        <Preview />
      </Route>
      <Route path="/_internal">
        <Inspect />
      </Route>
      <footer className="border-t border-zinc-200/50 bg-zinc-50 p-2 text-center inset-shadow-sm">
        <div className="text-sm">
          Made with {"❤️"} by{" "}
          <a
            href="https://github.com/davbrito"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 underline hover:text-zinc-900"
          >
            davbrito
          </a>
        </div>
        <div className="text-xs">
          Source code on{" "}
          <a
            href="https://github.com/davbrito/minurl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 underline hover:text-zinc-900"
          >
            GitHub
          </a>
        </div>
        <div className="text-xs">
          © {new Date().getFullYear()} David Brito. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default App;

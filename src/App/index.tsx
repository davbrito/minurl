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
      <footer className="border-t border-zinc-200/50 bg-zinc-50 inset-shadow-sm">
        <div className="flex items-center justify-center gap-2 p-2 text-sm">
          <span>
            Made with {"❤️"} by{" "}
            <a
              href="https://github.com/davbrito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 underline hover:text-zinc-900"
            >
              davbrito
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}

export default App;

import { useDebugValue } from "react";
import { createRoot } from "react-dom/client";
import { Route, Router, useLocation } from "wouter";

const root = document.getElementById("root");

const redirectUrl = new URL(`/minified`, window.location.href);

function App() {
  const [location, setLocation] = useLocation();
  const searchParams = useSearchParams();

  const minifiedUrl = searchParams.get("minified_url");
  const originalUrl = searchParams.get("url");

  return (
    <main>
      <header>
        <h1>miniurl</h1>
      </header>
      <Route path="/">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            const response = await fetch("/shorten_url", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();

            if (data.error) {
              alert(data.error);
              return;
            }

            setLocation(
              `/minified?minified_url=${data.url}&url=${formData.get("url")}`
            );
          }}
        >
          <p>Ingrese una url</p>
          <input required type="url" name="url" id="url-input" />
          <button type="submit">Minify URL</button>
        </form>
      </Route>
      <Route path="/minified">
        <p>
          <strong>Original:</strong>{" "}
          <a href={originalUrl} rel="noopener noreferrer">
            {originalUrl}
          </a>
        </p>
        <p>
          <strong>Minified:</strong>{" "}
          <a href={minifiedUrl} rel="noopener noreferrer">
            {new URL(minifiedUrl, window.location.href).toString()}
          </a>
        </p>
      </Route>
    </main>
  );
}

createRoot(root).render(
  <Router>
    <App />
  </Router>
);

function useSearchParams() {
  const [location] = useLocation();
  const url = new URL(window.location.href);
  const { searchParams } = url;
  useDebugValue(searchParams);
  return searchParams;
}

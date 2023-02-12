import { Route } from "wouter";
import Header from "../components/header";
import MinifyUrlForm from "../components/minify-url-form";
import Preview from "../components/preview";
import * as styles from "./styles.module.css";

const redirectUrl = new URL(`/minified`, window.location.href);

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
    </main>
  );
}

export default App;

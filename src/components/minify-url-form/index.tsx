import { useLocation } from "wouter";
import * as styles from "./styles.module.css";

const MinifyUrlForm = () => {
  const [location, setLocation] = useLocation();

  return (
    <form
      className={styles.root}
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
      <label className={styles.label} htmlFor="url-input">
        Ingrese una url
      </label>
      <input
        className={styles.input}
        required
        type="url"
        name="url"
        id="url-input"
        placeholder="https://en.wikipedia.org/wiki/URL_shortening"
      />
      <button className={styles.button} type="submit">
        Minify URL
      </button>
    </form>
  );
};
export default MinifyUrlForm;

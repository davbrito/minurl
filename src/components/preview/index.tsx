import useSearchParams from "../../hooks/useSearchParams";
import styles from "./styles.module.css";

const Preview = () => {
  const searchParams = useSearchParams();

  const minifiedUrl = searchParams.get("minified_url");
  const originalUrl = searchParams.get("url");

  if (!minifiedUrl || !originalUrl) {
    return (
      <div className={styles.container}>
        <p>Error: Missing URL parameters.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p>
        <strong>Original:</strong>{" "}
        <a href={originalUrl} rel="noopener noreferrer">
          {originalUrl}
        </a>
      </p>
      <p>
        <strong>Minified:</strong>{" "}
        <a href={minifiedUrl} rel="noopener noreferrer">
          {new URL(minifiedUrl, window.location.href).href}
        </a>
      </p>
    </div>
  );
};
export default Preview;

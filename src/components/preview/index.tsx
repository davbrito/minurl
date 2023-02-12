import useSearchParams from "../../hooks/useSearchParams";
import * as styles from "./styles.module.css";

const Preview = () => {
  const searchParams = useSearchParams();

  const minifiedUrl = searchParams.get("minified_url");
  const originalUrl = searchParams.get("url");

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
          {new URL(minifiedUrl, window.location.href).toString()}
        </a>
      </p>
    </div>
  );
};
export default Preview;

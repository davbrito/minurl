import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("_internal", "./routes/_internal.tsx"),
  route("minified/:id", "./routes/minified-id.tsx")
];

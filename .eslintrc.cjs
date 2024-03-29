module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    // "plugin:@typescript-eslint/recommended",
  ],
  //   parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      jsxRuntime: "automatic",
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
    //    "@typescript-eslint"
  ],
  rules: {
    "no-unused-vars": 2,
  },
};

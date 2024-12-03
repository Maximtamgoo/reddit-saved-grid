import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactRefresh.configs.recommended,
      pluginQuery.configs["flat/recommended"]
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: { ...globals.browser, ...globals.node }
    },
    settings: { react: { version: "detect" } },
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      ...reactHooks.configs.recommended.rules
    }
  }
);

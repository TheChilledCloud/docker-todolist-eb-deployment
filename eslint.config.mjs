import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // --------------------
  // Backend / Node.js
  // --------------------
  {
    files: ["backend/**/*.js", "server.js", "healthcheck.js"], // adjust if your backend folder is different
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node }, // Node.js globals: process, __dirname, etc.
      parserOptions: { ecmaVersion: 2025 },
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }], // ignore unused args & catch vars
    },
  },

  // --------------------
  // Frontend / browser
  // --------------------
  {
    files: ["public/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser }, // Browser globals: window, document, etc.
      parserOptions: { ecmaVersion: 2025 },
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }], // ignore unused args & catch vars
    },
  },
]);

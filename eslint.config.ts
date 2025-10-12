import tseslint from "typescript-eslint";
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist", "build", "node_modules", "generated"]),
  {
    files: ["./src/**/*.{ts}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    basePath: "./src",
    ignores: ["/dist", "generated", "node_modules"],
    rules: {
      ...js.configs.recommended.rules,
      "@typescript-eslint/no-unused-imports": "error",
    },
    ...tseslint.configs.eslintRecommended,
  },
]);

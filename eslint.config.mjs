import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat config (docs/06-ARCHITECTURE.md §1.2).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // private research and local tooling (CLAUDE.md §4)
    "references/**",
    ".venv-ig/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files:
    "public/pagefind/**",
    // Utility scripts (not part of the Next.js app):
    "scripts/**",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      // useEffect(() => setMounted(true), []) is an idiomatic React hydration
      // guard pattern — not a cascading-render risk in this codebase.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;

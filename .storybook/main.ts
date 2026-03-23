import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../components/**/*.mdx", "../components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@chromatic-com/storybook"
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, ".."),
      "next/image": path.resolve(__dirname, "mocks/next-image.tsx"),
      "next/link": path.resolve(__dirname, "mocks/next-link.tsx"),
      "next/navigation": path.resolve(__dirname, "mocks/next-navigation.tsx"),
      "next-themes": path.resolve(__dirname, "mocks/next-themes.tsx"),
    };

    config.define = {
      ...config.define,
      "process.env": JSON.stringify({}),
    };

    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // Stub out Pagefind dynamic import so SearchModal doesn't crash in Storybook.
    // Vite's import-analysis plugin rejects imports from /public before resolveId
    // can redirect them, so we rewrite the import specifier during transform instead.
    const pagefindStub = path.resolve(__dirname, "mocks/pagefind.ts");
    config.plugins.push({
      name: "stub-pagefind",
      enforce: "pre" as const,
      resolveId(id: string) {
        if (id === "virtual:pagefind-stub") {
          return pagefindStub;
        }
      },
      transform(code: string, id: string) {
        if (id.includes("search-modal") && code.includes("pagefind/pagefind.js")) {
          return code.replace(
            /import\([\s\S]*?["']\/pagefind\/pagefind\.js["'][\s\S]*?\)/,
            'import("virtual:pagefind-stub")'
          );
        }
      },
    });

    return config;
  },
};

export default config;

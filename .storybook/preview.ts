import type { Preview } from "@storybook/react-vite";
import "./fonts.css";
import "../app/globals.css";

const preview: Preview = {
  globalTypes: {
    darkMode: {
      description: "Toggle dark mode",
      toolbar: {
        title: "Dark Mode",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    darkMode: "light",
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.darkMode === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      // Same page background as the site: the surface token flips with .dark
      document.documentElement.style.backgroundColor = "var(--color-surface)";
      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;

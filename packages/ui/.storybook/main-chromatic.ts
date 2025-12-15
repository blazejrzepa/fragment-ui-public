import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: [
    "../src/**/*.stories.@(tsx|mdx)",
    "../../blocks/src/**/*.stories.@(tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
    "@chromatic-com/storybook",
  ],
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    const alias: Record<string, string> = {
      "@fragment_ui/tokens/dist/tokens.css": path.resolve(__dirname, "../../tokens/dist/tokens.css"),
    };
    
    return mergeConfig(config, {
      resolve: {
        alias,
        preserveSymlinks: false,
        dedupe: [
          "@storybook/core",
          "@storybook/react",
          "@storybook/react-vite",
        ],
      },
      server: {
        fs: {
          strict: false,
        },
      },
      optimizeDeps: {
        include: [
          "@storybook/core",
          "@storybook/react",
          "@storybook/addon-essentials",
          "react-colorful", // Required for ColorPicker component
        ],
        force: true,
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/],
          transformMixedEsModules: true,
        },
      },
    });
  },
};

export default config;


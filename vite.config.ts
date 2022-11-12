import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { devPlugin, getReplacer } from "./plugins/devPlugin";
import optimizer from "vite-plugin-optimizer";
import { buildPlugin } from "./plugins/buildPlugin";

export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  build: {
      // assetsInlineLimit: 0,
      // minify: false,
      rollupOptions: {
        plugins: [buildPlugin()],
      },
    },
});
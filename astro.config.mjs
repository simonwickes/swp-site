// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://simonwickes.com",
  output: "static",

  build: {
    format: "directory",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes("/api/") && !page.includes("/image-test") && !page.includes("/admin"),
      serialize(item) {
        if (item.url.includes("/blog/")) {
          item.changefreq = "weekly";
          item.priority = 0.7;
        } else if (item.url.includes("/services/")) {
          item.changefreq = "monthly";
          item.priority = 0.8;
        } else if (item.url === "https://simonwickes.com/") {
          item.changefreq = "weekly";
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
});

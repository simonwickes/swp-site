// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://simonwickes.com",
  adapter: netlify(),
  build: {
    format: "directory",
  },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

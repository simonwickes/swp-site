import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      tags: z.array(z.string()).optional(),
      featuredImage: image().optional(),
      featuredImageAlt: z.string().optional(),
      galleryUrl: z.string().url().optional(),
      author: z.string().default("simon"),
    }),
});

export const collections = { blog };

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getServiceBySlug } from "@/data/services";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const searchData = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      category: post.data.category,
      categoryTitle:
        getServiceBySlug(post.data.category)?.title ?? post.data.category,
      tags: post.data.tags ?? [],
      date: post.data.date.toISOString(),
      excerpt: post.body?.slice(0, 200) ?? "",
    }));

  return new Response(JSON.stringify(searchData), {
    headers: { "Content-Type": "application/json" },
  });
};

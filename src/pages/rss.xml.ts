import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

// One feed; the post type is included per entry as a category (spec §5.5.4).
// RSS is the whole distribution strategy — no algorithm, no list we hold over
// the reader. Posts are files in the repo; the feed just points at them.
export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "Arachne",
    description:
      "Essays, use cases, and notes on building visible, bounded, auditable automation for knowledge work.",
    site: context.site ?? "https://arachne.example.com",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [post.data.type],
    })),
  });
}

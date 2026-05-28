import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog content collection (spec §5.5). Posts are markdown files in the repo,
 * git-versioned — the same ownership grain as flows. The generator renders
 * them; the file is canonical.
 *
 * `type` drives layout, the index chip, and the per-type prev/next.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    type: z.enum(["essay", "usecase", "note"]),
    title: z.string(),
    /** One-line description shown on the index row and post header. */
    dek: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    /** Use Cases: the bundled template this post narrates. */
    template: z.string().optional(),
    /** Quiet link back to the relevant product page (spec §5.5.3). */
    relatedHref: z.string().optional(),
    relatedLabel: z.string().optional(),
  }),
});

export const collections = { blog };

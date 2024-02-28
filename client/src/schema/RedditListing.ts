import { z } from "zod";

const preview = z.object({
  images: z
    .array(
      z.object({
        id: z.string(),
        resolutions: z.array(
          z.object({
            url: z.string(),
            width: z.number(),
            height: z.number()
          })
        )
      })
    )
    .length(1)
});

const gallery_data = z.object({
  items: z.array(
    z.object({
      media_id: z.string()
    })
  )
});

const media_metadata = z.record(
  z.string(),
  z.object({
    id: z.string().nullish(),
    p: z.array(
      z.object({
        u: z.string(),
        x: z.number(),
        y: z.number()
      })
    )
  })
);

export const ListingItem = z.object({
  kind: z.string(),
  data: z.object({
    url: z.string().optional(),
    name: z.string(),
    title: z.string().optional(),
    author: z.string(),
    subreddit: z.string(),
    permalink: z.string(),
    post_hint: z.string().optional(),
    is_gallery: z.boolean().optional(),
    preview: preview.nullish(),
    gallery_data: gallery_data.nullish(),
    media_metadata: media_metadata.nullish()
  })
});

export type ListingItem = z.infer<typeof ListingItem>;

export const RedditListing = z.object({
  kind: z.literal("Listing"),
  data: z.object({
    after: z.string().or(z.null()),
    before: z.string().or(z.null()),
    children: z.array(ListingItem),
    dist: z.number()
  })
});

export type RedditListing = z.infer<typeof RedditListing>;

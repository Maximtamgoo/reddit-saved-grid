import { z } from "zod";

const Post = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  subreddit: z.string(),
  permalink: z.string(),
  saved: z.boolean()
});

const ImageData = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
});

const ImagePost = Post.merge(
  z.object({
    type: z.literal("image"),
    card: ImageData,
    modal: ImageData
  })
);

const GalleryPost = Post.merge(
  z.object({
    type: z.literal("gallery"),
    card: ImageData,
    modal: z.array(ImageData)
  })
);

const UrlPost = Post.merge(
  z.object({
    type: z.literal("url"),
    card: z.object({ url: z.string() }),
    modal: z.object({ url: z.string() })
  })
);

const ErrorPost = Post.merge(
  z.object({
    type: z.literal("error")
  })
);

export const MasonryPost = z.discriminatedUnion("type", [
  ImagePost,
  GalleryPost,
  UrlPost,
  ErrorPost
]);

export type MasonryPost = z.infer<typeof MasonryPost>;

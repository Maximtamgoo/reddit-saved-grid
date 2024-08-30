import { array, boolean, Infer, literal, number, object, string, union } from "@badrap/valita";

const Base = object({
  id: string(),
  title: string(),
  author: string(),
  subreddit: string(),
  permalink: string(),
  saved: boolean(),
  pageParam: string()
});

const ImageData = object({
  url: string(),
  width: number(),
  height: number()
});

export type ImageData = Infer<typeof ImageData>;

const Image = object({
  type: literal("image"),
  preview: ImageData,
  source: ImageData,
  isGif: boolean()
}).extend(Base.shape);

const Gallery = object({
  type: literal("gallery"),
  preview: ImageData,
  gallery: array(ImageData)
}).extend(Base.shape);

const Text = object({
  type: literal("text"),
  text: string()
}).extend(Base.shape);

const Comment = object({
  type: literal("comment"),
  comment: string()
})
  .extend(Base.shape)
  .omit("title");

const Unknown = object({
  type: literal("unknown")
}).extend(Base.shape);

export const Post = union(Image, Gallery, Text, Comment, Unknown);

export type Post = Infer<typeof Post>;

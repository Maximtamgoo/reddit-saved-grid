import { array, boolean, Infer, literal, object, string, union } from "@badrap/valita";
import { ImageData, MediaData } from "./t3_link";

const Base = object({
  id: string(),
  title: string(),
  author: string(),
  subreddit: string(),
  permalink: string(),
  saved: boolean(),
  pageParam: string()
});

const Image = object({
  type: literal("image"),
  preview: ImageData,
  source: ImageData,
  isGif: boolean()
}).extend(Base.shape);

const Gallery = object({
  type: literal("gallery"),
  preview: MediaData,
  gallery: array(MediaData)
}).extend(Base.shape);

const Text = object({
  type: literal("text"),
  text: string()
}).extend(Base.shape);

const Comment = object({
  type: literal("comment"),
  text: string()
})
  .extend(Base.shape)
  .omit("title");

const Unknown = object({
  type: literal("unknown")
}).extend(Base.shape);

export const RedditItem = union(Image, Gallery, Text, Comment, Unknown);

export type RedditItem = Infer<typeof RedditItem>;

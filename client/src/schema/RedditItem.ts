import { array, boolean, Infer, literal, object, string, union } from "@badrap/valita";
import { Entry } from "./t3_link";

const Base = object({
  id: string(),
  icon_url: string().optional(),
  title: string(),
  author: string(),
  subreddit: string(),
  subreddit_name_prefixed: string(),
  permalink: string(),
  saved: boolean(),
  pageParam: string()
});

const Playable = object({
  type: literal("playable"),
  preview: Entry,
  source: Entry
});

const Image = object({
  type: literal("image"),
  preview: Entry,
  source: Entry
});

const GalleryItem = union(Playable, Image);
export type GalleryItem = Infer<typeof GalleryItem>;

const Gallery = object({
  type: literal("gallery"),
  preview: Entry,
  gallery: array(GalleryItem)
});

const Text = object({
  type: literal("text"),
  text: string()
});

const Comment = object({
  type: literal("comment"),
  text: string()
});

const Unknown = object({
  type: literal("unknown")
});

export const RedditItem = union(
  Gallery.extend(Base.shape),
  Playable.extend(Base.shape),
  Image.extend(Base.shape),
  Text.extend(Base.shape),
  Comment.extend(Base.shape).omit("title").omit("icon_url"),
  Unknown.extend(Base.shape)
);

export type RedditItem = Infer<typeof RedditItem>;

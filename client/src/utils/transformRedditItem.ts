import { ListingItem } from "@src/schema/Listing";
import type { GalleryItem, RedditItem } from "@src/schema/RedditItem";

export function transformRedditItem(item: ListingItem, pageParam: string): RedditItem | undefined {
  const { name: id, author, subreddit, subreddit_name_prefixed, permalink } = item.data;

  const base = {
    id,
    author,
    subreddit,
    subreddit_name_prefixed,
    permalink,
    saved: true,
    pageParam
  };

  if (item.kind === "t1") {
    return { ...base, type: "comment", text: item.data.body ?? "" };
  }

  if (item.kind === "t3") {
    const { is_self, selftext, preview, is_gallery, gallery_data, media_metadata, title, url } =
      item.data;
    if (is_gallery && gallery_data && media_metadata) {
      const gallery: GalleryItem[] = [];
      for (const item of gallery_data.items) {
        const mm = media_metadata[item.media_id];
        if (mm.status === "valid" && mm.p && mm.s) {
          const largestResolution = mm.p[mm.p.length - 1];
          gallery.push({
            type: mm.s.mp4 ? "playable" : "image",
            preview: {
              url: largestResolution.mp4 || largestResolution.u || "",
              width: largestResolution.x,
              height: largestResolution.y
            },
            source: {
              url: mm.s.mp4 || mm.s.u || "",
              width: mm.s.x,
              height: mm.s.y
            }
          });
        }
      }

      return {
        ...base,
        type: "gallery",
        title,
        preview: gallery[0].preview,
        gallery
      };
    }

    if (preview && preview.images) {
      const resolutions = preview.images[0].resolutions;
      const redditItem = {
        ...base,
        title,
        preview: resolutions[resolutions.length - 1]
      };
      if (preview.images[0].variants.mp4) {
        return { ...redditItem, type: "playable", source: preview.images[0].variants.mp4.source };
      }
      if (preview && preview.reddit_video_preview) {
        return {
          ...redditItem,
          type: "playable",
          source: {
            url: preview.reddit_video_preview.fallback_url,
            width: preview.reddit_video_preview.width,
            height: preview.reddit_video_preview.height
          }
        };
      }
      return { ...redditItem, type: "image", source: preview.images[0].source };
    }

    if (url) {
      const urlSplit = url.split(".");
      const extension = urlSplit && urlSplit[urlSplit.length - 1];
      if (["jpeg", "jpg", "png", "gif"].includes(extension)) {
        const imageData = { url, width: 350, height: 350 };
        return {
          ...base,
          type: "image",
          title,
          preview: imageData,
          source: imageData
        };
      }
    }

    if (is_self && selftext) {
      return { ...base, type: "text", title, text: selftext };
    }

    return { ...base, type: "unknown", title };
  }

  return undefined;
}

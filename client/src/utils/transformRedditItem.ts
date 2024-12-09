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
    const {
      is_self,
      selftext,
      preview,
      is_gallery,
      gallery_data,
      media_metadata,
      title,
      url,
      sr_detail
    } = item.data;

    const icon_url = sr_detail.community_icon ?? sr_detail.icon_img ?? undefined;

    const t3_base = { ...base, title, icon_url };

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
        ...t3_base,
        type: "gallery",
        preview: gallery[0].preview,
        gallery
      };
    }

    if (preview && preview.images) {
      const resolutions = preview.images[0].resolutions;
      const redditItem = {
        ...t3_base,
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
          ...t3_base,
          type: "image",
          preview: imageData,
          source: imageData
        };
      }
    }

    if (is_self && selftext) {
      return { ...t3_base, type: "text", text: selftext };
    }

    return { ...t3_base, type: "unknown" };
  }

  return undefined;
}

import { ListingItem } from "@src/schema/Listing";
import { RedditItem } from "@src/schema/RedditItem";

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
    const { selftext, preview, is_gallery, gallery_data, media_metadata, title, url } = item.data;
    if (is_gallery && gallery_data && media_metadata) {
      let preview = undefined;
      const gallery = [];
      for (const item of gallery_data.items) {
        const mm = media_metadata[item.media_id];
        if (mm.status === "valid") {
          if (preview === undefined) preview = mm.p[mm.p.length - 1];
          gallery.push(mm.s);
        }
      }

      if (preview) {
        return {
          ...base,
          type: "gallery",
          title,
          preview,
          gallery
        };
      }
    }

    if (preview && preview.images) {
      const resolutions = preview.images[0].resolutions;
      return {
        ...base,
        type: "image",
        title,
        preview: resolutions[resolutions.length - 1],
        source: preview.images[0].source,
        isGif: !!preview.images[0].variants.gif
      };
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
          source: imageData,
          isGif: extension === "gif"
        };
      }
    }

    if (selftext) {
      return { ...base, type: "text", title, text: selftext };
    }

    return { ...base, type: "unknown", title };
  }

  return undefined;
}

import { ListingItem } from "@src/schema/Listing";
import { Post } from "@src/schema/Post";

export function trimListingItem(item: ListingItem, pageParam: string): Post | undefined {
  const { name: id, author, subreddit, permalink } = item.data;

  if (item.kind === "t3") {
    const { is_self, preview, is_gallery, gallery_data, media_metadata, title } = item.data;
    const post = {
      id,
      title,
      author,
      subreddit,
      permalink,
      saved: true,
      pageParam
    };

    if (is_self && item.data.selftext) {
      return {
        ...post,
        type: "text",
        text: item.data.selftext ?? ""
      };
    } else if (is_gallery && gallery_data && media_metadata) {
      const gallery = [];
      for (const item of gallery_data.items) {
        const resolutions = media_metadata[item.media_id].p;
        if (resolutions) {
          const { url, width, height } = resolutions[resolutions.length - 1];
          gallery.push({ url, width, height });
        }
      }

      return {
        ...post,
        type: "gallery",
        preview: gallery[0],
        gallery
      };
    } else if (preview && preview.images) {
      const resolutions = preview.images[0].resolutions;
      const gifSource = preview.images[0].variants.gif?.resolutions.at(-1);
      const sourceUrl = gifSource ? gifSource : preview.images[0].source;

      return {
        ...post,
        type: "image",
        preview: resolutions[resolutions.length - 1],
        source: sourceUrl,
        isGif: !!gifSource
      };
    } else {
      return undefined;
    }
  } else {
    return {
      id,
      author,
      subreddit,
      permalink,
      saved: true,
      type: "comment",
      comment: item.data.body ?? "",
      pageParam
    };
  }
}

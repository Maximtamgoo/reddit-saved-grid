import { ListingItem } from "@src/schema/Listing";
import { Post } from "@src/schema/Post";

export function trimListingItem(item: ListingItem): Post {
  const { name: id, author, subreddit, permalink } = item.data;

  if (item.kind === "t3") {
    const { is_self, preview, is_gallery, gallery_data, media_metadata, title } = item.data;
    const post: Post = {
      type: "unknown",
      id,
      title,
      author,
      subreddit,
      permalink,
      saved: true
    };

    if (is_self && item.data.selftext) {
      return {
        ...post,
        type: "text",
        text: item.data.selftext ?? ""
      };
    } else if (is_gallery && gallery_data && media_metadata) {
      const resolutions = media_metadata[gallery_data.items[0].media_id].p;
      const urlGallery: string[] = [];
      for (const item of gallery_data.items) {
        const resolutions = media_metadata[item.media_id].p;
        if (resolutions) urlGallery.push(resolutions[resolutions.length - 1].u);
      }

      return {
        ...post,
        type: "gallery",
        preview: resolutions && resolutions[resolutions.length - 1].u,
        gallery: urlGallery
      };
    } else if (preview && preview.images) {
      const resolutions = preview.images[0].resolutions;
      const gifSource = preview.images[0].variants.gif?.source.url;
      const sourceUrl = gifSource ? gifSource : preview.images[0].source.url;

      return {
        ...post,
        type: "image",
        preview: resolutions[resolutions.length - 1].url,
        source: sourceUrl,
        isGif: !!gifSource
      };
    } else {
      return post;
    }
  } else {
    return {
      id,
      author,
      subreddit,
      permalink,
      saved: true,
      type: "comment",
      comment: item.data.body ?? ""
    };
  }
}

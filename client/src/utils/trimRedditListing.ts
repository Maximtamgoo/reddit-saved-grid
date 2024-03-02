import { ListingItem, RedditListing } from "../schema/RedditListing";

type Gallery =
  | {
      isGallery: true;
      galleryLength: number;
    }
  | {
      isGallery: false;
    };

export type Post = {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  permalink: string;
  saved: true;
} & {
  url?: string;
  width?: number;
  height?: number;
} & Gallery;

function extractData(item: ListingItem) {
  const WIDTH = 400;

  const { name: id, title = "", author, subreddit, permalink } = item.data;

  const post: Post = {
    id,
    title,
    author,
    subreddit,
    permalink,
    saved: true,
    url: undefined,
    width: undefined,
    height: undefined,
    isGallery: false
  };

  const { post_hint, preview } = item.data;
  if ((post_hint === "image" || post_hint === "link" || post_hint?.includes("video")) && preview) {
    const resolutions = preview.images[0].resolutions;
    for (const res of resolutions) {
      if (res.width >= WIDTH) {
        return { ...post, ...res };
      }
    }
    return { ...post, ...resolutions[resolutions.length - 1] };
  }
  const { is_gallery, gallery_data, media_metadata } = item.data;
  if (is_gallery && gallery_data && media_metadata) {
    const first_media_id = gallery_data.items[0].media_id;
    const resolutions = media_metadata[first_media_id].p;
    for (const res of resolutions) {
      if (res.x >= WIDTH) {
        const { u: url, x: width, y: height } = res;
        return {
          ...post,
          url,
          width,
          height,
          isGallery: true,
          galleryLength: gallery_data.items.length
        };
      }
    }
    return { ...post, ...resolutions[resolutions.length - 1] };
  }
  const url = item.data.url;
  const ext = url?.split(".")[url.split(".").length - 1];
  if (url && (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif")) {
    return { ...post, url };
  }

  return post;
}

export default function trimRedditListing(listing: RedditListing) {
  const trimmed = listing.data.children.map((item) => extractData(item));

  return {
    after: listing.data.after,
    posts: trimmed
  };
}

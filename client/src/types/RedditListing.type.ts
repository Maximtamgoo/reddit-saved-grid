export type ListingItem = {
  kind: string;
  data: {
    url?: string;
    name: string;
    title?: string;
    author: string;
    preview?: {
      images: [
        {
          resolutions: [
            {
              url: string;
              width: number;
              height: number;
            }
          ];
        }
      ];
    };
    subreddit: string;
    permalink: string;
    post_hint?: string;
    is_gallery?: boolean;
    gallery_data?: {
      items: [{ media_id: string }];
    };
    media_metadata?: {
      [key: string]: {
        id: string;
        p: [
          {
            u: string;
            x: number;
            y: number;
          }
        ];
      };
    };
  };
};

export type RedditListing = {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    children: ListingItem[];
  };
};

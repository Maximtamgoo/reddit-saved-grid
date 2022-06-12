export type RedditListing = {
  data: {
    after: string,
    children: ListingItem[]
  }
}

export type ListingItem = {
  data: {
    url: string,
    name: string,
    title: string,
    author: string,
    preview: {
      images: [{
        resolutions: [{
          url: string
        }]
      }]
    },
    subreddit: string,
    permalink: string,
    post_hint: string,
    is_gallery: string,
    gallery_data: {
      items: [{ media_id: string }]
    },
    media_metadata: {
      [key: string]: {
        p: [{
          u: string
        }]
      }
    }
  }
}

export type SavedPost = {
  src: string,
  name: string,
  title: string,
  author: string,
  authorLink: string,
  subreddit: string,
  subredditLink: string,
  postLink: string,

  saved: boolean
}
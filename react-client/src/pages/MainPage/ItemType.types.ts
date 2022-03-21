type ItemType = {
  author: string,
  subreddit_name_prefixed: string,
  permalink: string,
  post_hint: string,
  url: string,
  is_gallery: string,
  title: string,
  preview: {
    images: [{
      resolutions: [{
        url: string
      }]
    }]
  },
  gallery_data: {
    items: [{ media_id: string }]
  },
  name: string,
  media_metadata: {
    [key: string]: {
      p: [{
        u: string
      }]
    }
  }
}

export default ItemType
interface Post {
  id: string
  title: string
  author: string
  subreddit: string
  permalink: string
  saved: boolean
}

interface ImageData {
  url: string
  width: number
  height: number
}

interface ImagePost extends Post {
  type: 'image'
  card: ImageData
  modal: ImageData
}

interface GalleryPost extends Post {
  type: 'gallery'
  card: ImageData
  modal: ImageData[]
}

interface UrlPost extends Post {
  type: 'url'
  card: {
    url: string
  }
  modal: {
    url: string
  }
}

interface ErrorPost extends Post {
  type: 'error'
}

export type MasonryPost = ImagePost | GalleryPost | UrlPost | ErrorPost
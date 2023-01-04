import { MasonryPost } from '../types/MasonryPost.type.js'
import { ListingItem } from '../types/RedditListing.type.js'

export function convertToMasonryPosts(listingItems: ListingItem[]): MasonryPost[] {
  // console.log('listingItems:', listingItems)
  return listingItems.map((item) => {
    const { name: id, title = '', author, subreddit, permalink } = item.data

    const masonryPost: MasonryPost = {
      id,
      title,
      author,
      subreddit,
      permalink,
      saved: true,
      type: 'error'
    }

    const { post_hint, preview } = item.data
    if ((post_hint === 'image' || post_hint === 'link' || post_hint?.includes('video')) && preview) {
      const resolutions = preview.images[0].resolutions
      let pickedRes = resolutions[0]
      for (const res of resolutions) {
        if (res.width > 300) {
          pickedRes = res
          break
        }
      }

      return {
        ...masonryPost,
        type: 'image',
        card: pickedRes,
        modal: resolutions[resolutions.length - 1]
      }
    }

    const { is_gallery, gallery_data, media_metadata } = item.data
    if (is_gallery && gallery_data && media_metadata) {
      const first_media_id = gallery_data.items[0].media_id
      const resolutions = media_metadata[first_media_id].p
      let pickedRes = resolutions[0]
      for (const res of resolutions) {
        if (res.x > 300) {
          pickedRes = res
          break
        }
      }

      const modalArray = []
      for (const { media_id } of gallery_data.items) {
        const resolutions = media_metadata[media_id].p
        const highRes = resolutions[resolutions.length - 1]
        modalArray.push({
          url: highRes.u,
          width: highRes.x,
          height: highRes.y
        })
      }

      return {
        ...masonryPost,
        type: 'gallery',
        card: {
          url: pickedRes.u,
          width: pickedRes.x,
          height: pickedRes.y
        },
        modal: modalArray
      }
    }

    const url = item.data.url
    const ext = url?.split('.')[url.split('.').length - 1]
    if (url && ((ext === 'jpg') || (ext === 'jpeg') || (ext === 'png') || (ext === 'gif'))) {
      return {
        ...masonryPost,
        type: 'url',
        card: {
          url
        },
        modal: {
          url
        }
      }
    }

    return masonryPost
  })
}
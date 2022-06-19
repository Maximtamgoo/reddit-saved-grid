import { ListingItem, SavedPost } from '../types/RedditListing.types'

export default function extractWantedData(listingItem: ListingItem[]): SavedPost[] {
  // console.log('data:', data)
  return listingItem.map((item) => {
    const {
      url,
      name,
      title,
      author,
      preview,
      subreddit,
      permalink,
      post_hint,
      is_gallery,
      gallery_data,
      media_metadata
    } = item.data

    const authorLink = `https://www.reddit.com/u/${author}`
    const subredditLink = `https://www.reddit.com/r/${subreddit}`
    const postLink = `https://www.reddit.com${permalink}`

    let src = ''
    // const postHint = item?.post_hint
    const ext = url?.split('.')[url?.split('.')?.length - 1]

    if (post_hint) {
      if (post_hint === 'image' || post_hint === 'link' || post_hint.includes('video')) {
        const resolutions = preview?.images?.[0]?.resolutions
        src = resolutions?.[resolutions?.length - 1]?.url
      }
    } else if (is_gallery) {
      const media_id = gallery_data?.items?.[0]?.media_id
      const p = media_metadata?.[media_id]?.p
      src = p?.[p?.length - 1]?.u
    } else if ((ext === 'jpg') || (ext === 'png') || (ext === 'gif')) {
      src = url
    }

    return {
      src,
      id: name,
      title,
      author,
      authorLink,
      subreddit,
      subredditLink,
      postLink,

      saved: true
    }
  })
}
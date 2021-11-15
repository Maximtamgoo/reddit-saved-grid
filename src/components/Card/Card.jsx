import { useState } from 'react'
import style from './Card.module.css'
import { ReactComponent as BookmarkIcon } from '../../svg/bookmark.svg'
import { ReactComponent as FileHelpIcon } from '../../svg/file-help.svg'
import api from '../../services/api'

export default function Card({ item }) {
  const [saved, setSaved] = useState(true)
  // console.log('%c item:', 'color: red', item)

  const authorLink = `https://www.reddit.com/u/${item.author}`
  const subredditLink = `https://www.reddit.com/${item.subreddit_name_prefixed}`
  const postLink = `https://www.reddit.com${item.permalink}`

  let src = null
  const post_hint = item?.post_hint
  const ext = item?.url?.split('.')[item?.url?.split('.')?.length - 1]

  if (post_hint) {
    if (post_hint === 'image' || post_hint === 'link' || post_hint.includes('video')) {
      const resolutions = item?.preview?.images?.[0]?.resolutions
      src = resolutions?.[resolutions?.length - 1]?.url
    }
  } else if (item?.is_gallery) {
    const media_id = item?.gallery_data?.items?.[0]?.media_id
    const p = item?.media_metadata?.[media_id]?.p
    src = p?.[p?.length - 1]?.u
  } else if ((ext === 'jpg') || (ext === 'png') || (ext === 'gif')) {
    src = item?.url
  }
  // else if (ext !== 'jpg') {
  //   console.log('%c title:', 'color: red', item.subreddit)
  //   console.log('%c item:', 'color: red', item)
  // }

  const onClick = async () => {
    try {
      if (saved) {
        await api.unsaveContent(item.name)
        setSaved(false)
      } else {
        await api.saveContent(item.name)
        setSaved(true)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }
  //style={{ border: (!item.parts.post_hint) ? '5px solid red' : null }}
  return (
    <div className={style.card}>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.links}>
            <a href={subredditLink} target='_blank' rel="noreferrer">{item.subreddit_name_prefixed}</a>
            <span style={{ margin: '2px' }}>&middot;</span>
            <a href={authorLink} target='_blank' rel="noreferrer">{item.author}</a>
          </div>
          <a className={style.title} href={postLink} target='_blank' rel="noreferrer">{item.title}</a>
        </div>
        <div className={style.bookmark} onClick={onClick}>
          <BookmarkIcon className={style.icon}
            style={{ fill: (saved) ? 'var(--blue)' : 'none' }}
          />
        </div>
      </div>

      <a href={postLink} target='_blank' rel="noreferrer"
        style={{ color: 'var(--blue)' }}>
        {src ?
          <img src={src} alt="Reddit Content" />
          :
          <div className={style.filehelp}>
            <FileHelpIcon className={style.icon} />
          </div>
        }
      </a>
    </div>
  )
}
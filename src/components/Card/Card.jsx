import { useState } from 'react'
import style from './Card.module.css'
import { ReactComponent as BookmarkIcon } from '../../svg//bookmark.svg'
import { saveContent, unsaveContent } from '../../services/reddit'
import getCookie from '../../utils/getCookie'

export default function Card({ item }) {
  const [saved, setSaved] = useState(true)

  const authorLink = `https://www.reddit.com/u/${item.author}`
  const subredditLink = `https://www.reddit.com/${item.subreddit}`
  const postLink = `https://www.reddit.com${item.permalink}`

  const onClick = async () => {
    try {
      let access_token = getCookie('access_token')
      if (saved) {
        await unsaveContent(item.id, access_token)
        setSaved(false)
      } else {
        await saveContent(item.id, access_token)
        setSaved(true)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
    <div className={style.card}>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.links}>
            <a href={subredditLink} target='_blank' rel="noreferrer">{item.subreddit}</a>
            <span style={{ margin: '2px' }}>&middot;</span>
            <a href={authorLink} target='_blank' rel="noreferrer">{item.author}</a>
          </div>
          <a className={style.title} href={postLink} target='_blank' rel="noreferrer">{item.title}</a>
        </div>
        <div className={style.bookmark} onClick={onClick}>
          <BookmarkIcon className={style.icon}
            style={{fill: (saved) ? 'var(--blue)': 'none' }}
          />
        </div>
      </div>

      <img src={item.src} alt="Reddit Content" />
    </div>
  )
}
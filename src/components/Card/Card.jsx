import style from './Card.module.css'
import { ReactComponent as BookmarkIcon } from '../../svg//bookmark.svg';

export default function Card({ item }) {
  const authorLink = `https://www.reddit.com/u/${item.author}`
  const subredditLink = `https://www.reddit.com/${item.subreddit}`
  const postLink = `https://www.reddit.com${item.permalink}`

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
        <div className={style.bookmark}>
          <BookmarkIcon className={style.icon} />
        </div>
      </div>

      <img src={item.src} alt="Reddit Content" />
    </div>
  )
}
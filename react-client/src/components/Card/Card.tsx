import style from './Card.module.css'
import { SavedPost } from '../../types/RedditListing.types'

type Props = {
  savedPost: SavedPost,
  openModal: (savedPost: SavedPost) => void
}

export default function Card({ savedPost, openModal }: Props) {
  return (
    <div className={style.card}>
      <div onClick={() => openModal(savedPost)}
        style={{ color: 'var(--blue)' }}>
        {savedPost.src ?
          <img src={savedPost.src} alt="Reddit Content" />
          :
          <div className={style.unknown}>?</div>
        }
      </div>
    </div>
  )
}
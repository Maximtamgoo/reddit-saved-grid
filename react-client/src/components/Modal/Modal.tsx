import { useState } from 'react'
import { SavedPost } from '../../types/RedditListing.types'
import style from './Modal.module.css'
import { bookmarkContent } from '../../services/api'
import { ReactComponent as BookmarkIcon } from '../../svg/bookmark.svg'

type Props = {
  isOpen: boolean,
  closeModal: () => void,
  modalData: SavedPost | null,
  setBookmarkState: (name: string, saved: boolean) => void
}

export default function Modal({ isOpen, closeModal, modalData, setBookmarkState }: Props) {
  const {
    src,
    id,
    title,
    author,
    authorLink,
    subreddit,
    subredditLink,
    postLink
  } = modalData ?? {}

  const [saved, setSaved] = useState(modalData?.saved)

  async function handleBookmark() {
    try {
      if (id) {
        await bookmarkContent(id, (saved) ? 'unsave' : 'save')
        setSaved(!saved)
        setBookmarkState(id, !saved)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className={style.background}>
      <div className={style.center}>
        <div className={style.modal}>
          <div className={style.img_wrapper} onClick={closeModal}>
            {src ?
              <img className={style.modal_img} src={src} alt="Reddit Content" />
              :
              <div className={style.unknown}>?</div>
            }
          </div>
          <div className={style.modal_actions}>
            <div className={style.info}>
              <div className={style.links}>
                <a href={subredditLink} target='_blank' rel="noreferrer">r/{subreddit}</a>
                <span style={{ margin: '2px' }}>&middot;</span>
                <a href={authorLink} target='_blank' rel="noreferrer">u/{author}</a>
              </div>
              <a className={style.title} href={postLink} target='_blank' rel="noreferrer">{title}</a>
            </div>
            <div className={style.bookmark} onClick={handleBookmark}>
              <BookmarkIcon className={style.icon}
                style={{ fill: (saved) ? 'var(--blue)' : 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
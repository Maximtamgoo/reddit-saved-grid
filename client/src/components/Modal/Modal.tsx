import { useState } from 'react'
import style from './Modal.module.css'
import { ReactComponent as LeftArrow } from '../../svg/chevron-left.svg'
import { ReactComponent as RightArrow } from '../../svg/chevron-right.svg'
import { ReactComponent as Bookmark } from '../../svg/bookmark.svg'
import useBookmark from '../../hooks/useBookmark'
import useGallery from '../../hooks/useGallery'
import { useStore } from '../../store'

type Props = {
  // opened: boolean,
  onClose: () => void
}

export default function Modal({ onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const data = useStore((state) => state.modalData)
  const { currentIndex, prevIndex, nextIndex } = useGallery(data.type === 'gallery' ? data.modal.length : 0)
  const { saved, toggle } = useBookmark(data.id, data.saved)

  document.body.style.overflow = 'hidden'
  document.body.style.height = '100%'
  document.body.style.scrollbarGutter = 'stable'

  async function onLoad() {
    // await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
  }

  function handleOnClose() {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    onClose()
  }

  const authorLink = `https://www.reddit.com/u/${data.author}`
  const subredditLink = `https://www.reddit.com/r/${data.subreddit}`
  const postLink = `https://www.reddit.com${data.permalink}`

  const ModalDetails = () => (
    <div className={style.modal_details} onClick={(e) => e.stopPropagation()}>
      <div className={style.info}>
        <div className={style.links}>
          <a href={subredditLink} target='_blank' rel="noreferrer">r/{data.subreddit}</a>
          <span style={{ margin: '2px' }}>&middot;</span>
          <a href={authorLink} target='_blank' rel="noreferrer">u/{data.author}</a>
        </div>
        <div className={style.links}>
          <a className={style.title} href={postLink} target='_blank' rel="noreferrer">{data.title || postLink}</a>
        </div>
      </div>
      <button className={style.bookmark_btn}
        onClick={toggle}
      >
        <Bookmark style={{ fill: (saved) ? 'var(--blue)' : 'none' }} />
      </button>
    </div>
  )

  if (data.type === 'image' || data.type === 'url') {
    return (
      <div className={style.modal} onClick={handleOnClose}>
        <div className={style.modal_img_wrapper}>
          <img className={style.modal_img} onLoad={onLoad} src={data.modal.url} alt="Reddit Content"
            style={{ filter: (loading) ? 'blur(1em)' : 'blur(0)' }}
          />
        </div>
        <ModalDetails />
      </div>
    )
  }

  if (data.type === 'gallery') {
    const leftDisabled = currentIndex === 0
    const rightDisabled = currentIndex === data.modal.length - 1
    return (
      <div className={style.modal} onClick={handleOnClose}>
        <div className={style.modal_img_wrapper}>
          <div className={style.gallery_btn_wrapper}>
            <div className={style.current_gallery_index}>{currentIndex + 1}/{data.modal.length}</div>
            <button className={style.gallery_btn} onClick={prevIndex}
              disabled={leftDisabled}
              style={{ visibility: (leftDisabled ? 'hidden' : 'visible') }}
            >
              <LeftArrow />
            </button>
            <button className={style.gallery_btn} onClick={nextIndex}
              disabled={rightDisabled}
              style={{ visibility: (rightDisabled ? 'hidden' : 'visible') }}
            >
              <RightArrow />
            </button>
          </div>
          <img className={style.modal_img} onLoad={onLoad} src={data.modal[currentIndex].url} alt="Reddit Content"
            style={{ filter: (loading) ? 'blur(1em)' : 'blur(0)' }}
          />
        </div>
        <ModalDetails />
      </div>
    )
  }

  return (
    <div className={style.modal} onClick={handleOnClose}>
      <div className={style.modal_img_wrapper}>
        <div className={style.error}>?</div>
      </div>
      <ModalDetails />
    </div>
  )
}
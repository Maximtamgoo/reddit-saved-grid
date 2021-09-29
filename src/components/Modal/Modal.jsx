import style from './Modal.module.css'
import { useState } from 'react';
import { ReactComponent as ExtLinkIcon } from '../../svg/external-link.svg';
import { ReactComponent as HeartIcon } from '../../svg/heart.svg';
import { ReactComponent as ChevronLeftIcon } from '../../svg/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../../svg/chevron-right.svg';
import Placeholder from '../Placeholder/Placeholder';

export default function Modal({ open, onClose, data }) {
  const [srcLoading, setSrcLoading] = useState(true)
  if (!open) return null

  console.log('Modal data:', data)
  // const imgSrc = data?.preview?.images[0]?.resolutions[data?.preview?.images[0]?.resolutions.length - 1].url

  const imgSrc = data.image

  const img = new Image()
  img.onload = async () => {
    // await new Promise(r => setTimeout(r, 2000))
    setSrcLoading(false)
  }
  img.src = imgSrc

  function handleExtLink() {
    window.open(`https://www.reddit.com${data?.permalink}`, '_blank').focus();
  }

  async function handleHeartBtn() {
    return console.log('Canceled handleHeartBtn!')
    // try {
    //   setLoading(true)
    //   // await new Promise(r => setTimeout(r, 3000))
    //   const access_token = getCookie('access_token')
    //   if (saved) {
    //     const data = await reddit.unsaveContent(id, access_token)
    //     console.log('unsave data:', data)
    //   } else {
    //     const data = await reddit.saveContent(id, access_token)
    //     console.log('save data:', data)
    //   }
    //   setSaved(saved => !saved)
    //   setLoading(false)
    // } catch (error) {
    //   console.log('error:', error)
    //   setError(error)
    //   setLoading(false)
    // }
  }

  const closeModal = (e) => {
    e.preventDefault()
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={style.modal} onClick={closeModal}>
      <div className={style.modal_body} onClick={closeModal}>
        {/* <div className={`${style.modal_box} ${style.btn} ${style.chevron_left}`}>
          <ChevronLeftIcon className={style.icon} />
        </div> */}
        <div className={`${style.modal_box} ${style.content}`}>
          {srcLoading ?
            <div className={style.loading}>
              <Placeholder />
            </div>
            :
            <img className={style.image} src={img.src} alt="Reddit Content" />
          }
        </div>
        {/* <div className={style.side_panel}>
          <div className={`${style.modal_box} ${style.btn} ${style.ext_link}`} onClick={handleExtLink}>
            <ExtLinkIcon className={style.icon} />
          </div>
          <div className={`${style.modal_box} ${style.btn} ${style.heart}`} onClick={handleHeartBtn}>
            <HeartIcon className={style.icon} />
          </div>
          <div className={`${style.modal_box} ${style.btn} ${style.chevron_right}`}>
            <ChevronRightIcon className={style.icon} />
          </div>
        </div> */}
      </div>
    </div>
  )
}
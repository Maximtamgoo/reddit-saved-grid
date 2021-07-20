import style from './Card.module.css'
import { useState } from 'react';
import Placeholder from '../Placeholder/Placeholder';
// import * as reddit from '../../services/reddit'
// import getCookie from '../../utils/getCookie'

export default function Card({ item }) {
  let imgSrc = null
  imgSrc = item?.preview?.images[0]?.resolutions[item?.preview?.images[0]?.resolutions.length - 1].url

  const [srcLoading, setSrcLoading] = useState(true)

  // async function handleHeartBtn() {
  //   return console.log('Canceled handleHeartBtn!')
  //   try {
  //     setLoading(true)
  //     // await new Promise(r => setTimeout(r, 3000))
  //     const access_token = getCookie('access_token')
  //     if (saved) {
  //       const data = await reddit.unsaveContent(id, access_token)
  //       console.log('unsave data:', data)
  //     } else {
  //       const data = await reddit.saveContent(id, access_token)
  //       console.log('save data:', data)
  //     }
  //     setSaved(saved => !saved)
  //     setLoading(false)
  //   } catch (error) {
  //     console.log('error:', error)
  //     setError(error)
  //     setLoading(false)
  //   }
  // }

  // function handleExtLink() {
  //   window.open(`https://www.reddit.com${item?.permalink}`, '_blank').focus();
  // }

  const img = new Image()
  img.onload = async () => {
    // await new Promise(r => setTimeout(r, 2000))
    setSrcLoading(false)
  }
  img.src = imgSrc

  return (
    <div className={style.card}>
      {srcLoading ?
        <div className={style.loading}>
          {/* //! shrinks when window resized */}
          <Placeholder />
        </div>
        :
        <img className={style.image} src={img.src} alt="Reddit Content" />
      }
      {/* <img className={style.img} src={imageSrc} alt="Reddit Content"
          onError={(e) => e.target.src = 'no-image-found.jpg'} /> */}
    </div>
  )
}
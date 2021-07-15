import style from './Card.module.css'
import { useState } from 'react';
import Placeholder from '../Placeholder/Placeholder';
// import * as reddit from '../../services/reddit'
// import getCookie from '../../utils/getCookie'
// import { ReactComponent as HeartIcon } from '../../svg/heart.svg';
// import { ReactComponent as EyeIcon } from '../../svg/eye.svg';
// import { ReactComponent as EyeOffIcon } from '../../svg/eye-off.svg';
// import { ReactComponent as ExtLinkIcon } from '../../svg/external-link.svg';
// import { ReactComponent as FullMaximizeIcon } from '../../svg/maximize.svg';
// import { ReactComponent as SmallMaximizeIcon } from '../../svg/maximize-2.svg';
// import { ReactComponent as MoreIcon } from '../../svg/more-vertical.svg';

export default function Card({ item }) {
  let imgSrc = null
  imgSrc = item?.preview?.images[0]?.resolutions[item?.preview?.images[0]?.resolutions.length - 1].url

  // const [saved, setSaved] = useState(true)
  const [srcLoading, setSrcLoading] = useState(true)
  // const [error, setError] = useState(null)

  // if (error) {
  //   return (
  //     <div className={style.card}>
  //       {`${error}`}
  //     </div>
  //   )
  // }

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

  function handleExtLink() {
    window.open(`https://www.reddit.com${item?.permalink}`, '_blank').focus();
  }

  const img = new Image()
  img.onload = async () => {
    // await new Promise(r => setTimeout(r, 2000))
    setSrcLoading(false)
  }
  img.src = imgSrc

  return (
    <div className={style.card} onClick={handleExtLink}>
      {srcLoading ?
        <div className={style.loading}>
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
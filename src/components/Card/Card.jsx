import style from './Card.module.css'
// import { useState } from 'react';
// import * as reddit from '../../services/reddit'
// import getCookie from '../../utils/getCookie'
// import { ReactComponent as HeartIcon } from '../../svg/heart.svg';
// import { ReactComponent as EyeIcon } from '../../svg/eye.svg';
// import { ReactComponent as EyeOffIcon } from '../../svg/eye-off.svg';
// import { ReactComponent as ExtLinkIcon } from '../../svg/external-link.svg';
// import { ReactComponent as FullMaximizeIcon } from '../../svg/maximize.svg';
// import { ReactComponent as SmallMaximizeIcon } from '../../svg/maximize-2.svg';
// import { ReactComponent as MoreIcon } from '../../svg/more-vertical.svg';

function Card({ id, imgSrc, over_18, permalink }) {
  // const [saved, setSaved] = useState(true)
  // const [loading, setLoading] = useState(false)
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

  // function handleExtLink() {
  //   window.open(`https://www.reddit.com${permalink}`, '_blank').focus();
  // }

  return (
    <div className={style.card}>
      <img className={style.image} src={imgSrc} alt="thumbnail" />
    </div>
  )
}

export default Card;
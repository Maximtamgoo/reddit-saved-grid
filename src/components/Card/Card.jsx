import style from './Card.module.css'
import { useState } from 'react';
import * as reddit from '../../services/reddit'
import getCookie from '../../utils/getCookie'
import { ReactComponent as SaveIcon } from '../../svg/plus.svg';
// import { ReactComponent as UnsaveIcon } from '../../svg/x.svg';
// import { ReactComponent as UnsaveIcon } from '../../svg/star.svg';
import { ReactComponent as UnsaveIcon } from '../../svg/heart.svg';


function Card({ id, imgSrc }) {
  const [saved, setSaved] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (error) {
    return (
      <div className={style.card}>
        {`${error}`}
      </div>
    )
  }

  async function handleClick() {
    try {
      setLoading(true)
      // await new Promise(r => setTimeout(r, 3000))
      const access_token = getCookie('access_token')
      if (saved) {
        const data = await reddit.unsaveContent(id, access_token)
        console.log('unsave data:', data)
      } else {
        const data = await reddit.saveContent(id, access_token)
        console.log('save data:', data)
      }
      setSaved(saved => !saved)
      setLoading(false)
    } catch (error) {
      console.log('error:', error)
      setError(error)
      setLoading(false)
    }
  }

  return (
    <div className={style.card}>
      {/* <div className={style.top}>
        top
      </div> */}
      <div className={style.middle}>
        {/* <div className={style.Bimage} style={{ backgroundImage: `url(${imgSrc})` }}></div> */}

        <img className={style.image} src={imgSrc} alt="thumbnail" />
      </div>
      <div className={style.bottom}>
      <UnsaveIcon className={style.icon} />
        {/* {loading ? 'loading...': 
          <button className={style['save-btn']} onClick={handleClick}>
            {saved ?
              <UnsaveIcon style={{}} className={style.icon} />
              :
              <><SaveIcon className={style.icon} /><b>Save</b></>}
          </button>
        } */}

        {/* <button className={style['save-btn']}>
          <UnsaveIcon className={style.icon} />Unsave
        </button> */}
      </div>
    </div>
  )
}

export default Card;
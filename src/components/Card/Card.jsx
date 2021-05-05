import style from './Card.module.css'
import { ReactComponent as SaveIcon } from '../../svg/plus.svg';
// import { ReactComponent as UnsaveIcon } from '../../svg/x.svg';

function Card({ imgSrc }) {

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
        <button className={style['save-btn']}>
          <SaveIcon className={style.icon} />Save
        </button>

        {/* <button className={style['save-btn']}>
          <UnsaveIcon className={style.icon} />Unsave
        </button> */}
      </div>
    </div>
  )
}

export default Card;
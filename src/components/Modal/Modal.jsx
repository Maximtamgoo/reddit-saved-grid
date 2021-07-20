import style from './Modal.module.css'
import { ReactComponent as ExtLinkIcon } from '../../svg/external-link.svg';
import { ReactComponent as HeartIcon } from '../../svg/heart.svg';
import { ReactComponent as ChevronLeftIcon } from '../../svg/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../../svg/chevron-right.svg';

export default function Modal() {
  return (
    <div className={style.modal}>
      <div className={style.modal_body}>
        <div className={`${style.modal_box} ${style.btn} ${style.chevron_left}`}>
          <ChevronLeftIcon className={style.icon} />
        </div>
        <div className={`${style.modal_box} ${style.content}`}>
          content
        </div>
        <div className={style.side_panel}>
          <div className={`${style.modal_box} ${style.btn} ${style.ext_link}`}>
            <ExtLinkIcon className={style.icon} />
          </div>
          <div className={`${style.modal_box} ${style.btn} ${style.heart}`}>
            <HeartIcon className={style.icon} />
          </div>
        </div>
        <div className={`${style.modal_box} ${style.btn} ${style.chevron_right}`}>
          <ChevronRightIcon className={style.icon} />
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import style from './Toggle.module.css'

function Toggle() {
  const [toggle, setToggle] = useState(false)
  const [disabled, setDisabled] = useState(false)

  function handleToggle() {
    console.log('handleToggle()')
    setDisabled(true)
    setToggle(!toggle)
    setDisabled(false)
  }

  return (
    <div className={style.toggle}>
      {/* <div className={style.label}>{toggle ? 'true' : 'false'}</div> */}
      <div className={style.label}>NSFW</div>
      <label className={style.switch}>
        <input type="checkbox" onClick={handleToggle} disabled={disabled} />
        <span className={`${style.slider} ${style.round}`} />
      </label>
    </div>
  )
}

export default Toggle
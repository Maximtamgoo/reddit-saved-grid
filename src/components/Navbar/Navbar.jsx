import style from './Navbar.module.css'
// import * as reddit from '../../services/reddit'
import Toggle from '../Toggle/Toggle'

function Navbar() {
  function handleBtn() {
    console.log('handleBtn signout')
  }

  return (
    <div className={style.navbar}>
      <div className={style.title} onClick={() => window.location.href = '/'}>
        Reddit Saved Grid
      </div>
      <div className={style.wrapper}>
        <Toggle />
        <button className={style.btn} onClick={handleBtn}>Sign Out</button>
      </div>
    </div>
  )
}

export default Navbar
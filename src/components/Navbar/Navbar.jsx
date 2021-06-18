import style from './Navbar.module.css'
// import * as reddit from '../../services/reddit'
// import Toggle from '../Toggle/Toggle'

export default function Navbar() {
  function handleBtn() {
    console.log('handleBtn signout')
  }

  return (
    <div className={style.navbar}>
      <div className={style.title}>Reddit Saved Grid</div>
      <button className={style.btn} onClick={handleBtn}>Sign Out</button>
    </div>
  )
}
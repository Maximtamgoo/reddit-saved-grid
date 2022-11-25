import style from './Navbar.module.css'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const auth = useAuth()

  return (
    <div className={style.navbar}>
      <div className={style.wrap}>
        <div className={style.title}>Reddit Saved Masonry</div>
        <div className={style.name}>u/{auth.name}</div>
      </div>
      <button className={style.btn} onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}
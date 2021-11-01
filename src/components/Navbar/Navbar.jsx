import style from './Navbar.module.css'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const auth = useAuth()

  return (
    <div className={style.navbar}>
      <div className={style.title}>Reddit Saved Grid</div>
      <button className={style.btn} onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}
import style from './Navbar.module.css'
import api from '../../services/api'

export default function Navbar() {
  async function handleBtn() {
    try {
      await api.signOut()
      window.location.reload()
    } catch (error) {
      console.log('signOut error:', error)
    }
  }

  return (
    <div className={style.navbar}>
      <div className={style.title}>Reddit Saved Grid</div>
      <button className={style.btn} onClick={handleBtn}>Sign Out</button>
    </div>
  )
}
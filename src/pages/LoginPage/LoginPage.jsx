import style from './LoginPage.module.css'
import api from '../../services/api';

export default function LoginPage() {
  console.log('Login Page')

  function handleBtn() {
    api.signInWithReddit()
  }

  return (
    <div className={style.login}>
      <div className={style.title}>Reddit Saved Grid</div>
        <button className={style.btn} onClick={handleBtn}>Sign In</button>
    </div>
  )
}
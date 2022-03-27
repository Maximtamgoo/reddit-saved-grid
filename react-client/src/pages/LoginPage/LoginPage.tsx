import style from './LoginPage.module.css'
import useAuth from '../../hooks/useAuth'

export default function LoginPage() {
  console.log('Login Page')
  const auth = useAuth()

  return (
    <div className={style.login}>
      <div className={style.title}>Reddit Saved Masonry</div>
      <button className={style.btn} onClick={() => auth.signInWithReddit()}>Login with Reddit</button>
    </div>
  )
}
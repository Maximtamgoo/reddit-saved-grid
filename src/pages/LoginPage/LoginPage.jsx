import style from './LoginPage.module.css'
import * as reddit from '../../services/reddit';

function LoginPage() {
  console.log('Login Page')

  function handleBtn() {
    reddit.authRedirect()
  }

  return (
    <div className={style.login}>
      <div className={style.title}>Reddit Saved Grid</div>
        <button className={style.btn} onClick={handleBtn}>Sign In</button>
    </div>
  )
}

export default LoginPage;
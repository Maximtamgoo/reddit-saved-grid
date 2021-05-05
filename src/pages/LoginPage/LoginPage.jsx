import * as reddit from '../../services/reddit';

function LoginPage() {
  console.log('Login Page')

  function handle_authRedirect() {
    reddit.authRedirect()
  }

  return (
    <div className="login-page">
      Login Page
      <button onClick={handle_authRedirect}>Authorize Web App</button>
    </div>
  )
}

export default LoginPage;
import useAuth from './hooks/useAuth'
import { LoginPage, MainPage } from './pages'

export default function App() {
  // console.log('App')
  const auth = useAuth()

  if (auth.loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="App">
      {auth.isAuthed ? <MainPage /> : <LoginPage />}
    </div>
  )
}
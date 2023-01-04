import useCheckSignedInUser from './hooks/useCheckSignedInUser'
import { LoginPage, MainPage } from './pages'

export default function App() {
  const { username, loading } = useCheckSignedInUser()

  if (loading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="App">
      {username ? <MainPage /> : <LoginPage />}
    </div>
  )
}
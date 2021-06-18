import './App.css';
import useAuth from './hooks/useAuth';
import { LoginPage, MainPage } from './pages';

export default function App() {
  // console.log('App')
  const [isAuthed, loading, error] = useAuth()

  if (error) {
    return (
      <div>
        {`${error}`}
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="App">
      {isAuthed ? <MainPage /> : <LoginPage />}
    </div>
  );
}
import { useState, useEffect, useContext, ReactNode } from 'react'
import AuthContext from '../Context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import api from '../services/api'

const pathname = window.location.pathname
const urlParams = new URLSearchParams(window.location.search)
const redirectParams = {
  state: urlParams.get('state'),
  code: urlParams.get('code'),
  error: urlParams.get('error')
}

window.history.replaceState({}, document.title, '/')
const redirectState = window.localStorage.getItem('redirect_state')
window.localStorage.clear()

export function AuthProvider(props: { children: ReactNode }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}

function useProvideAuth() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        if (redirectParams.error === 'access_denied') {
          throw redirectParams.error
        }

        let data: { username: string | null } = { username: null }
        if (
          pathname === '/auth_callback' &&
          redirectState === redirectParams.state &&
          redirectParams.code
        ) {
          data = await api.authorize(redirectParams.code)
        } else {
          data = await api.getMe()
        }

        if (data.username) {
          api.setUsername(data.username)
          setIsAuthed(true)
        }
      } catch (error) {
        // console.log('useEffect error:', error)
      }
      setLoading(false)
    })()
  }, [])

  function signInWithReddit() {
    const state = uuidv4()
    window.localStorage.setItem('redirect_state', state)
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_CLIENTID}&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`
  }

  async function signOut() {
    try {
      await api.signOut()
      setIsAuthed(false)
    } catch (error) {
      console.log('signOut error:', error)
    }
  }

  return { isAuthed, loading, signInWithReddit, signOut }
}
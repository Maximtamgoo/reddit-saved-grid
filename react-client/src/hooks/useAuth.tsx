import { useState, useEffect, useContext, ReactNode, useRef } from 'react'
import AuthContext from '../Context/AuthContext'
import * as api from '../services/api'

const pathname = window.location.pathname
const urlParams = new URLSearchParams(window.location.search)
const redirectParams = {
  code: urlParams.get('code'),
  error: urlParams.get('error')
}

window.history.replaceState({}, document.title, '/')

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
  const nameRef = useRef('')
  // const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        if (redirectParams.error === 'access_denied') {
          throw redirectParams.error
        }
        const data = (pathname === '/auth_callback' && redirectParams.code) ? await api.authorize(redirectParams.code) : await api.getMe()
        console.log('data:', data)
        if (data.name) {
          nameRef.current = data.name
          setIsAuthed(true)
        }
      } catch (error) {
        console.log('useEffect error:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function signInWithReddit() {
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_CLIENTID}&response_type=code&state=_&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`
  }

  async function signOut() {
    try {
      await api.signOut()
      setIsAuthed(false)
    } catch (error) {
      console.log('signOut error:', error)
    }
  }

  return { isAuthed, loading, name: nameRef.current, signInWithReddit, signOut }
}
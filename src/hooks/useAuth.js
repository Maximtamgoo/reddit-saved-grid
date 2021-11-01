import { useState, useEffect, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import api from '../services/api'

const pathname = window.location.pathname
const urlParams = new URLSearchParams(window.location.search)
const redirectParams = { state: urlParams.get('state'), code: urlParams.get('code') }
window.history.replaceState({}, document.title, "/")
const redirectState = window.localStorage.getItem('redirect_state')
window.localStorage.clear()

const AuthContext = createContext()

export function AuthProvider({ children }) {  
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}

export function useProvideAuth() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const data = (pathname === '/auth_callback' && redirectState === redirectParams.state) ? await api.authorize(redirectParams.code) : await api.getMe()
        // console.log('useAuth data:', data)
        if (data) {
          api.setUsername(data.username)
          setIsAuthed(true)
        }
      } catch (error) {
        console.log('useEffect error:', error)
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
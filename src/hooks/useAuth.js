import { useState, useEffect } from 'react'
import api from '../services/api'

const pathname = window.location.pathname
const urlParams = new URLSearchParams(window.location.search)
const redirectParams = { state: urlParams.get('state'), code: urlParams.get('code') }
window.history.replaceState({}, document.title, "/")
const redirectState = window.localStorage.getItem('redirect_state')
window.localStorage.clear()

export default function useAuth() {
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

  return [isAuthed, loading]
}
import { useState, useEffect } from 'react';
import * as reddit from '../services/reddit';

const pathname = window.location.pathname
const urlParams = new URLSearchParams(window.location.search)
const redirectParams = { state: urlParams.get('state'), code: urlParams.get('code') }
const redirectState = window.localStorage.getItem('redirect_state')
window.localStorage.clear()

export default function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // console.log('pathname:', pathname)
    // console.log('redirectState:', redirectState)
    // console.log('redirectParams.state:', redirectParams.state)
    if (pathname === '/auth_callback' && redirectState === redirectParams.state) {
      console.log('useEffect redirect: if')
      window.history.replaceState({}, document.title, "/")
      fetchFunc(reddit.requestAccessToken, redirectParams.code)
    } else {
      console.log('useEffect authorize: else')
      fetchFunc(reddit.authorize)
    }

    async function fetchFunc(func, params) {
      try {
        const res = await func(params)
        if (res.status === 200) {
          setIsAuthed(true)
        }
      } catch (error) {
        console.log('useEffect fetchFunc() error:', error)
        setError(error)
      }
      setLoading(false)
    }
  }, [])

  return [isAuthed, loading, error]
}
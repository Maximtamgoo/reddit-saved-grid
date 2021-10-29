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

  // useEffect(() => {
  //   // console.log('pathname:', pathname)
  //   // console.log('redirectState:', redirectState)
  //   // console.log('redirectParams.state:', redirectParams.state)
  //   if (pathname === '/auth_callback' && redirectState === redirectParams.state) {
  //     console.log('useEffect authorize: if')
  //     window.history.replaceState({}, document.title, "/")
  //     authorize(redirectParams.code)
  //     // fetchWrapper(api.authorize, redirectParams.code)
  //   } else {
  //     console.log('useEffect login: else')
  //     login()
  //     // fetchWrapper(api.login)
  //   }

  //   async function authorize(code) {
  //     try {
  //       const res = await api.authorize(code)


  //       if (res.status === 200) {
  //         setIsAuthed(true)
  //       }
  //     } catch (error) {
  //       console.log('useEffect fetchFunc() error:', error)
  //       setError(error)
  //     }
  //     setLoading(false)
  //   }

  //   async function login() {
  //     try {
  //       const data = await reddit.getMe()
  //       if (res.status === 200) {
  //         reddit.setUsername(data.name)
  //         setIsAuthed(true)
  //       }
  //     } catch (error) {
  //       console.log('useEffect fetchFunc() error:', error)
  //       setError(error)
  //     }
  //     setLoading(false)
  //   }

  // async function fetchWrapper(func, params) {
  //   try {
  //     const res = await func(params)
  //     if (res.status === 200) {
  //       setIsAuthed(true)
  //     }
  //   } catch (error) {
  //     console.log('useEffect fetchFunc() error:', error)
  //     setError(error)
  //   }
  //   setLoading(false)
  // }
  // }, [])

  return [isAuthed, loading]
}
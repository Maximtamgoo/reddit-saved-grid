import style from './Navbar.module.css'
import useAuth from '../../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import { throttle } from 'lodash'

export default function Navbar() {
  const [shrink, setShrink] = useState(false)
  const auth = useAuth()
  const navRef = useRef()

  useEffect(() => {
    window.onscroll = throttle(function () {
      setShrink((shrink) => {
        if (!shrink && navRef.current.offsetTop > 70) return true
        if (shrink && navRef.current.offsetTop < 70) return false
        return shrink
      })
    }, 100)
  }, [])

  return (
    <div ref={navRef} className={`${style.navbar} ${shrink ? style.shrink : ''}`}>
      <div className={style.title}>Reddit Saved Masonry</div>
      <button className={style.btn} onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}
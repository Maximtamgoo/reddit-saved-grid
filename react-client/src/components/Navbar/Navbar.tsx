import style from './Navbar.module.css'
import useAuth from '../../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import { throttle } from 'lodash'

export default function Navbar() {
  const [shrink, setShrink] = useState(false)
  const auth = useAuth()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const throttleScroll = throttle(() => {
      setShrink((shrink) => {
        if (null !== navRef.current) {
          if (!shrink && navRef.current.offsetTop > 70) return true
          if (shrink && navRef.current.offsetTop < 70) return false
        }
        return shrink
      })
    }, 100)

    window.addEventListener('scroll', throttleScroll)

    return () => {
      window.removeEventListener('scroll', throttleScroll)
    }
  }, [])

  return (
    <div ref={navRef} className={`${style.navbar} ${shrink ? style.shrink : ''}`}>
      <div className={style.title}>Reddit Saved Masonry</div>
      <button className={style.btn} onClick={() => auth.signOut()}>{auth.name} | Sign Out</button>
    </div>
  )
}
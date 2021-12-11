import style from './Navbar.module.css'
import useAuth from '../../hooks/useAuth'
// import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  // const [shrink, setShrink] = useState(false)
  const auth = useAuth()
  // const ref = useRef()

  // TODO shrink or hide navbar on scroll
  // useEffect(() => {
  //   window.onscroll = function () {
  //     console.log('ref.current:', ref.current.offsetTop)
  //     if (ref.current.offsetTop > 60) {
  //       setShrink(true)
  //     } else {
  //       setShrink(false)
  //     }
  //   }
  // }, [])

  // <div ref={ref} className={`${style.navbar} ${shrink ? style.shrink : ''}`}>

  return (
    <div className={style.navbar}>
      <div className={style.title}>Reddit Saved Masonry</div>
      <button className={style.btn} onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}
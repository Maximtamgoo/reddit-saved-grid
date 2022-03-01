import { useState, useRef, useEffect } from 'react'

export default function useIntersectionObserver() {
  const [inView, setInView] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    if (targetRef.current) {
      observer = new IntersectionObserver(([entries]) => {
        setInView(entries.isIntersecting)
      })
      observer.observe(targetRef.current)
    }

    return () => {
      setInView(false)
      if (observer instanceof IntersectionObserver) {
        observer.disconnect()
      }
    }
  }, [])

  return { targetRef, inView }
}
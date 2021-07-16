import { useState, useEffect, useRef } from "react"

export default function useIntersectionObserver() {
  const [inView, setInView] = useState(false)
  const targetRef = useRef()
  const observerRef = useRef()

  useEffect(() => {
    console.log('useEffect IntersectionObserver')

    let observer = observerRef.current
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    })

    const target = targetRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      console.log('disconnect')
      observer.disconnect()
    }
  }, [])

  return [targetRef, inView]
}
import { useState, useEffect, useRef } from "react"

export default function useIntersectionObserver() {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef()
  const observerRef = useRef()

  useEffect(() => {
    console.log('useEffect IntersectionObserver')

    let observer = observerRef.current
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, { threshold: 1 })

    const target = targetRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      console.log('disconnect')
      observer.disconnect()
    }
  }, [])

  return [targetRef, isIntersecting]
}
import { useState, useRef, useCallback } from "react"

export default function useIntersectionObserver() {
  const [inView, setInView] = useState(false)

  const observerRef = useRef()

  const targetCallbackRef = useCallback((node) => {
    if (!node) return observerRef.current.disconnect()

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      console.log('isIntersecting:', entry.isIntersecting)
    })
    observer.observe(node)
    observerRef.current = observer
  }, [])

  return [targetCallbackRef, inView]
}
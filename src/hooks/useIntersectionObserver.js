import { useState, useCallback } from "react"

export default function useIntersectionObserver() {
  const [inView, setInView] = useState(false)

  const targetCallbackRef = useCallback((node) => {
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      // console.log('isIntersecting:', entry.isIntersecting)
    })
    observer.observe(node)
  }, [])

  return [targetCallbackRef, inView]
}
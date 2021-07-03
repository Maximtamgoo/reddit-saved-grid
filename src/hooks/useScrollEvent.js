import { useEffect, useRef } from "react";

export default function useScrollEvent(callback) {

  const cbRef = useRef(callback)

  function scrollEvent() {
    cbRef.current()
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent)
    return () => window.removeEventListener('scroll', scrollEvent)
  }, [])
}
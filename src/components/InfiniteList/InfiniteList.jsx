import { useEffect, useRef } from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import style from './InfiniteList.module.css'

export default function InfiniteList({ parentStyle, fetchMore, hasMore = true, loader, children }) {
  const pendingRef = useRef(false)
  const [ref, inView] = useIntersectionObserver()

  useEffect(() => {
    if (inView && !pendingRef.current && hasMore) {
      (async () => {
        pendingRef.current = true
        await fetchMore()
        pendingRef.current = false
      })()
    }
  }, [inView, hasMore, fetchMore])

  return (
    <>
      <div className={parentStyle}>
        {children}
      </div>
      {hasMore ?
        <div ref={ref} className={style.loader_wrapper}>
          <div className={style.loader}>{loader}</div>
        </div>
        :
        <div className={style.theend}>The End</div>
      }
    </>
  )
}

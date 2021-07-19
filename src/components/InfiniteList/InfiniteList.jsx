import { useState, useEffect, useCallback, useRef } from "react"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import style from './InfiniteList.module.css'

export default function InfiniteList({ parentStyle, fetchMore, loader, children }) {
  const pendingRef = useRef(false)
  const [hasMore, setHasMore] = useState(true)
  const [ref, inView] = useIntersectionObserver()
  // const [error, setError] = useState(null)

  const fetchMoreWrapper = useCallback(async () => {
    try {
      pendingRef.current = true
      const hasMore = await fetchMore()
      if (!hasMore) {
        setHasMore(hasMore)
      }
      pendingRef.current = false
    } catch (error) {
      console.log('fetchMoreWrapper error:', error)
    }
  }, [fetchMore])

  useEffect(() => {
    // console.log('useEffect fetchMoreWrapper')
    // console.log('useEffect:', { inView, pendingRef: pendingRef.current, hasMore })
    if (inView && !pendingRef.current && hasMore) {
      // console.log('%c run fetchMore', 'color: red')
      fetchMoreWrapper()
      // console.log('%c fetchMore end', 'color: red')
    }
  }, [inView, hasMore, fetchMoreWrapper])

  return (
    <div className={style.infinite_list}>
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
    </div>
  )
}

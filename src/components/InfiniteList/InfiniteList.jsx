import { useState, useEffect, useCallback, useRef } from "react"
// import useIntersectionObserver from "../../hooks/useIntersectionObserver"
import { useInView } from 'react-intersection-observer';
import style from './InfiniteList.module.css'

export default function InfiniteList({ parentStyle, fetchMore, loader, children }) {
  const pendingRef = useRef(false)
  // const [pending, setPending] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // const [ref, inView] = useIntersectionObserver()
  // console.log('inView:', inView)
  // const [error, setError] = useState(null)
  const { ref, inView } = useInView()

  const fetchMoreWrapper = useCallback(async () => {
    try {
      pendingRef.current = true
      // setPending(true)
      const hasMore = await fetchMore()
      if (!hasMore) {
        setHasMore(hasMore)
      }
      // setHasMore(hasMore)
      pendingRef.current = false
      // setPending(false)
    } catch (error) {
      console.log('fetchMoreWrapper error:', error)
    }
  }, [fetchMore])

  // useEffect(() => {
  //   console.log('useEffect inital fetchMoreWrapper')
  //   fetchMoreWrapper()
  // }, [fetchMoreWrapper])

  useEffect(() => {
    // console.log('useEffect fetchMoreWrapper')
    console.log('useEffect:', { inView, pendingRef: pendingRef.current })
    if (inView && !pendingRef.current) {
      console.log('run fetchMore')
      fetchMoreWrapper()
      console.log('fetchMore end')
    }
  }, [inView, fetchMoreWrapper])

  const Loader = () => (
    <div ref={ref} className={style.loader_wrapper}>
      <div className={style.loader}>{loader}</div>
    </div>
  )

  return (
    <div className={style.infinite_list}>
      <div className={parentStyle}>
        {children}
      </div>
      {hasMore && <Loader />}
      {!hasMore && <div className={style.theend}>The End</div>}
    </div>
  )
}

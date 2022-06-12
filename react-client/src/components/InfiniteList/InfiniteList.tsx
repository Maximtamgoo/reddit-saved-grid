import { useEffect, useRef, ReactNode } from 'react'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import style from './InfiniteList.module.css'

type Props = {
  fetchMore: () => void,
  hasMore: boolean,
  loader: ReactNode,
  children: ReactNode
}

export default function InfiniteList({ fetchMore, hasMore = true, loader, children }: Props) {
  const pendingRef = useRef(false)
  const { targetRef, inView } = useIntersectionObserver()

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
      {children}
      {hasMore ?
        <div ref={targetRef} className={style.loader_wrapper}>
          <div className={style.loader}>{loader}</div>
        </div>
        :
        <div className={style.theend}>The End</div>
      }
    </>
  )
}

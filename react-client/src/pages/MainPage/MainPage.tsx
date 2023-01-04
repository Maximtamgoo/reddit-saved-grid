import style from './MainPage.module.css'
import { useState } from 'react'
import { useStore } from '../../store'
import useWindowWidth from '../../hooks/useWindowWidth'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Navbar from '../../components/Navbar/Navbar'
import Card from '../../components/Card/Card'
import Modal from '../../components/Modal/Modal'
import { ReactComponent as Loader } from '../../svg/three-dots.svg'
import { getSavedContent } from '../../services/oauthReddit'
import { XMasonry, XBlock } from 'react-xmasonry'
import { MasonryPost } from '../../types/MasonryPost.type'
import { convertToMasonryPosts } from '../../utils/convertToMasonryPosts'

export default function MainPage() {
  // console.log('MainPage')
  const width = useWindowWidth()
  const list = useStore((state) => state.list)
  const [opened, setOpened] = useState(false)
  const [after, setAfter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function fetchMore() {
    // console.log('fetchMore')
    const username = useStore.getState().username
    if (username) {
      setLoading(true)
      const redditListing = await getSavedContent(username, after)
      // console.log('redditListing:', redditListing)
      const masonryPosts = convertToMasonryPosts(redditListing.data.children)
      // console.log('masonryPosts:', masonryPosts)
      if (!redditListing.data.after) {
        setHasMore(false)
      }
      setAfter(redditListing.data.after)
      useStore.getState().appendList(masonryPosts)
      setLoading(false)
    }
  }

  const [targetRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: fetchMore,
    rootMargin: '0px 0px 100px 0px'
  })

  function onOpen(masonryPost: MasonryPost) {
    useStore.getState().setModalData(masonryPost)
    setOpened(true)
  }

  return (
    <>
      {opened && <Modal onClose={() => setOpened(false)} />}
      <Navbar />
      <div className={style.max_width}>
        <XMasonry
          targetBlockWidth={(width <= 500) ? Math.floor(width / 2) : 300}
        >
          {list.map(masonryPost => (
            <XBlock key={masonryPost.id}>
              <Card data={masonryPost} onOpen={() => onOpen(masonryPost)} />
            </XBlock>
          ))}
        </XMasonry>
        {(loading || hasMore) && <div ref={targetRef} className={style.loader}>
          <Loader />
        </div>}
        {!hasMore && <>
          <div className={style.theend}>The End?</div>
          <div className={style.limit_msg}>(Reddit has a 1000 saved post limit)</div>
        </>}
      </div>
    </>
  )
}
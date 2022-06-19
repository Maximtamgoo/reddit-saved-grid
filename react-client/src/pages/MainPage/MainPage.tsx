import style from './MainPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Card from '../../components/Card/Card'
import InfiniteList from '../../components/InfiniteList/InfiniteList'
import { useState, useCallback, useRef } from 'react'
import api from '../../services/api'
import { ReactComponent as LoaderIcon } from '../../svg/three-dots.svg'
import { XMasonry, XBlock } from 'react-xmasonry'
import useAuth from '../../hooks/useAuth'
import useWindowWidth from '../../hooks/useWindowWidth'
import Modal from '../../components/Modal/Modal'
import extractSavedPosts from '../../helpers/extractSavedPosts'
import { RedditListing, SavedPost } from '../../types/RedditListing.types'

export default function MainPage() {
  // console.log('MainPage')
  const auth = useAuth()
  const width = useWindowWidth()
  const [list, setList] = useState<SavedPost[]>([])
  const [hasMore, setHasMore] = useState(true)
  const afterRef = useRef<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<SavedPost | null>(null)

  function openModal(savedPost: SavedPost) {
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100%'
    setModalData(savedPost)
    setIsOpen(true)
  }

  function closeModal() {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    setIsOpen(false)
  }

  function setBookmarkState(id: string, saved: boolean) {
    setList((oldList) => {
      return oldList.map(savedPost => {
        return (savedPost.id === id) ? { ...savedPost, saved } : savedPost
      })
    })
  }

  const fetchMore = useCallback(async () => {
    console.log('fetchMore')
    try {
      const redditListing: RedditListing = await api.getSavedContent(afterRef.current)
      // console.log('%c redditListing', 'color: red', redditListing)
      afterRef.current = redditListing.data.after
      const newItems = extractSavedPosts(redditListing.data.children)
      setList((oldItems) => ([...oldItems, ...newItems]))
      if (redditListing.data.after === null) setHasMore(false)
    } catch (error) {
      const err = error as { name: string }
      if (err.name === 'UnauthorizedError') {
        auth.signOut()
      }
    }
  }, [auth])

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} modalData={modalData} setBookmarkState={setBookmarkState} />
      <Navbar />
      <InfiniteList
        fetchMore={fetchMore}
        hasMore={hasMore}
        loader={<LoaderIcon />}
      >
        <div className={style.max_width}>
          <XMasonry
            targetBlockWidth={(width <= 500) ? Math.floor(width / 2) : 300}
          >
            {list.map(savedPost => (
              <XBlock key={savedPost.id}>
                <Card savedPost={savedPost} openModal={openModal} />
              </XBlock>
            ))}
          </XMasonry>
        </div>
      </InfiniteList>
    </>
  )
}
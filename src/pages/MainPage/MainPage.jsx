import style from './MainPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Card from '../../components/Card/Card'
import InfiniteList from '../../components/InfiniteList/InfiniteList'
import { useState, useCallback, useRef } from 'react'
import api from '../../services/api'
import { ReactComponent as LoaderIcon } from '../../svg/three-dots.svg'
import { XMasonry, XBlock } from 'react-xmasonry'
import useAuth from '../../hooks/useAuth'

export default function MainPage() {
  // console.log('MainPage')
  const auth = useAuth()
  const [list, setList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const afterRef = useRef()

  const fetchMore = useCallback(async () => {
    console.log('fetchMore')
    try {
      const savedContent = await api.getSavedContent(afterRef.current)
      // console.log('%c SavedContent', 'color: red', savedContent)
      afterRef.current = savedContent.data.after
      const newItems = savedContent.data.children.map(item => {
        // console.log('title:', item.data.title)
        // console.log('item.data:', item.data)
        return item.data
      })

      setList((oldItems) => ([...oldItems, ...newItems]))
      if (savedContent.data.after === null) setHasMore(false)
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        auth.signOut()
      }
    }
  }, [auth])

  return (
    <>
      <Navbar />
      <InfiniteList
        fetchMore={fetchMore}
        hasMore={hasMore}
        loader={<LoaderIcon />}
      >
        <div className={style.wrap}>
          <XMasonry
            targetBlockWidth={400}
          >
            {list.map(item => (
              <XBlock>
                <Card key={item.name} item={item} />
              </XBlock>
            ))}
          </XMasonry>
        </div>
      </InfiniteList>
    </>
  )
}
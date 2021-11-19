import style from './MainPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Card from '../../components/Card/Card'
import InfiniteList from '../../components/InfiniteList/InfiniteList'
import { useState, useCallback, useRef } from 'react'
import api from '../../services/api'
import { ReactComponent as LoaderIcon } from '../../svg/loader.svg'
import Masonry from 'react-masonry-component'
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
          <Masonry
            className={style.grid}
            options={{
              // transitionDuration: 0,
              itemSelector: `.${style.grid_item}`,
              columnWidth: `.${style.grid_item}`,
              percentPosition: true,
              gutter: 10
            }}
          >
            {list.map(item => (
              <div key={item.name} className={style.grid_item}>
                <Card item={item} />
              </div>
            ))}
          </Masonry>
        </div>
      </InfiniteList>
    </>
  )
}
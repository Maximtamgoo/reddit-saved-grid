import style from './MainPage.module.css';
// import useSavedContent from '../../hooks/useSavedContent';
// import useScrollEvent from '../../hooks/useScrollEvent';
// import Gallery from '../../components/Gallery/Gallery';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';
import InfiniteList from '../../components/InfiniteList/InfiniteList';
import { useState, useCallback, useRef } from 'react';
import getCookie from '../../utils/getCookie';
import * as reddit from '../../services/reddit';
import { ReactComponent as LoaderIcon } from '../../svg/loader.svg';
import Masonry from 'react-masonry-css'

export default function MainPage() {
  // console.log('MainPage')
  const [list, setList] = useState([])
  const usernameRef = useRef(null)
  const optionsRef = useRef({ after: undefined })

  // if (error) {
  //   return (
  //     <div>
  //       {`${error}`}
  //     </div>
  //   )
  // }

  // if (loading) {
  //   return (
  //     <div>
  //       MainPage Loading...
  //     </div>
  //   )
  // }

  const fetchMore = useCallback(async () => {
    console.log('fetchMore')
    // const savedContent = new Array(9).fill({name: null})
    // const newItems = savedContent.map((e, i) => { return { name: i } })

    // setList((oldItems) => ([...oldItems, ...newItems]))
    // return true

    // console.log('%c options after', 'color: green', optionsRef.current.after);
    let access_token = getCookie('access_token')
    if (!access_token) {
      await reddit.refreshAccessToken()
      access_token = getCookie('access_token')
    }
    if (usernameRef.current === null) {
      const me = await reddit.getMe(access_token)
      usernameRef.current = me.name
    }

    // const savedContent = await reddit.getFakeData()
    const savedContent = await reddit.getSavedContent(access_token, usernameRef.current, optionsRef.current)
    console.log('%c SavedContent', 'color: red', savedContent)
    optionsRef.current.after = savedContent.data.after
    const newItems = savedContent.data.children.map(item => {
      // console.log('item:', item)
      if (!item.data?.preview) {
        console.log('item:', item)
      }

      // console.log('item.name:', item.name)
      const resolutions = item.data?.preview?.images[0]?.resolutions
      // console.log('resolutions:', resolutions)
      const lastImg = resolutions?.[resolutions?.length - 1]
      // console.log('lastImg:', lastImg)
      // const lastImg = resolutions[1]

      return {
        id: item.data.name,
        src: lastImg?.url ?? '',
        width: lastImg?.width ?? 100,
        height: lastImg?.height ?? 100,
      }
    })
    setList((oldItems) => ([...oldItems, ...newItems]))
    return (savedContent.data.after === null) ? false : true
  }, [])

  const breakpointCols = {
    default: 3,
    // 1100: 3,
    700: 2,
    500: 1
  }

  return (
    <div className={style.main}>
      <Navbar />
      <InfiniteList
        parentStyle={style.gallery}
        fetchMore={fetchMore}
        loader={<LoaderIcon />}
      >
        {list.length > 0 &&
          <Masonry
            breakpointCols={breakpointCols}
            className={style.masonry_grid}
            columnClassName={style.masonry_grid_column}
          >
            {list.map(item => <Card key={item.id} item={item} />)}
          </Masonry>}
      </InfiniteList>
    </div>
  )
}
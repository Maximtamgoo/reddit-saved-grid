import style from './MainPage.module.css';
// import useSavedContent from '../../hooks/useSavedContent';
// import useScrollEvent from '../../hooks/useScrollEvent';
// import Gallery from '../../components/Gallery/Gallery';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';
import InfiniteList from '../../components/InfiniteList/InfiniteList';
import { useState, useRef, useCallback } from 'react';
import getCookie from '../../utils/getCookie';
import * as reddit from '../../services/reddit';
import { ReactComponent as LoaderIcon } from '../../svg/loader.svg';

export default function MainPage() {
  // console.log('MainPage')
  const [list, setList] = useState([])
  // const [hasMore, setHasMore] = useState(true)
  // const hasMoreRef = useRef(true)
  const usernameRef = useRef(null)
  const optionsRef = useRef({ after: undefined })

  // const [data, pending, getMore, error] = useSavedContent()
  // console.log('pending:', pending)
  // const getMoreRef = useRef(getMore)

  // function checkIfAtBottomThenGetMore() {
  //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  //     console.log('%c AT BOTTOM ', 'color: red');
  //     // console.log('innerHeight + scrollY:', window.innerHeight + window.scrollY)
  //     // console.log('offsetHeight:', document.body.offsetHeight)
  //     // getMore()
  //   }
  // }

  // useScrollEvent(checkIfAtBottomThenGetMore)

  // useEffect(() => {
  //   console.log('main page useEffect')
  //   checkIfAtBottomThenGetMore()
  // }, [checkIfAtBottomThenGetMore])

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

  // function handle_nextSavedContent() {
  //   // getMoreRef.current()
  //   checkIfAtBottomThenGetMore()
  // }

  const fetchMore = useCallback(async () => {
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
    const savedContent = await reddit.getSavedContent(access_token, usernameRef.current, optionsRef.current)
    console.log('%c SavedContent', 'color: red', savedContent);
    // if (savedContent.data.after === null) setHasMore(false)
    optionsRef.current.after = savedContent.data.after
    const newItems = savedContent.data.children.map(item => item.data)
    setList((oldItems) => ([...oldItems, ...newItems]))
    return (savedContent.data.after === null) ? false : true
  }, [])

  return (
    <div className={style.main}>
      <Navbar />
      {/* <div className={style.gallery}> */}
      <InfiniteList fetchMore={fetchMore} loader={<LoaderIcon />}>
        <div className={style.gallery}>
        {/* {(targetRef) => {
          return (
            <div className={style.gallery}>
              {list.map((item, i) => {
                if (i === list.length - 1) {
                  return (
                    <div key={item.name} className={style.item} ref={targetRef}>
                      <Card item={item} />
                    </div>
                  )
                } else {
                  return (
                    <div key={item.name} className={style.item}>
                      <Card item={item} />
                    </div>
                  )
                }
              })}
            </div>
          )
        }} */}
        {list.map(item => <Card key={item.name} item={item} />)}
        </div>
      </InfiniteList>
      {/* </div> */}

      {/* <div ref={intersectionRef} className={style.loader}>loading...</div> */}
      {/* {pending && <div className={style.loader} style={{visibility: !pending}} >loading...</div>} */}
      {/* <button onClick={handle_nextSavedContent}>Next Saved Content</button> */}
    </div>
  )
}
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
    // console.log('%c SavedContent', 'color: red', savedContent);
    // if (savedContent.data.after === null) setHasMore(false)
    optionsRef.current.after = savedContent.data.after
    const newItems = savedContent.data.children.map(item => item.data)
    setList((oldItems) => ([...oldItems, ...newItems]))
    return (savedContent.data.after === null) ? false : true
  }, [])

  return (
    <div className={style.main}>
      <Navbar />
      <InfiniteList parentStyle={style.gallery} fetchMore={fetchMore} loader={<LoaderIcon />}>
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
      </InfiniteList>
    </div>
  )
}
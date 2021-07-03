import { useState, useEffect, useRef } from "react";
import getCookie from '../utils/getCookie';
import * as reddit from '../services/reddit';

export default function useSavedContent() {
  const [data, setData] = useState([])
  const [username, setUsername] = useState()
  const [next, setNext] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const [options, setOptions] = useState({ after: undefined, count: undefined })
  const optionsRef = useRef()
  optionsRef.current = options

  useEffect(() => {
    // console.log('useEffect getMe')
    ; (async () => {
      try {
        let access_token = getCookie('access_token')
        if (!access_token) {
          await reddit.refreshAccessToken()
          access_token = getCookie('access_token')
        }
        const me = await reddit.getMe(access_token)
        setUsername(me.name)
      } catch (error) {
        setError(error)
        setPending(false)
      }
    })()
  }, [])

  useEffect(() => {
    console.log('useEffect getSavedContent')
      ; (async () => {
        // console.log('next:', next)
        // console.log('username:', username)
        if (next && username && !pending && hasMore) {
          setNext(false)
          setPending(true)
          try {
            // console.log('useEffect getSavedContent: if next && username')
            let access_token = getCookie('access_token')
            if (!access_token) {
              await reddit.refreshAccessToken()
              access_token = getCookie('access_token')
            }
            const savedContent = await reddit.getSavedContent(access_token, username, optionsRef.current)
            // const fakeItems = await reddit.getFakeData()

            const { after, before, count, children } = savedContent.data
            console.log('%c SavedContent', 'color: red', savedContent);
            // const { after, dist: count } = savedContent.data
            if (after === null) setHasMore(false)
            setOptions({ after, count })

            const newItems = savedContent.data.children.map(item => {
              const { name, over_18, post_hint, preview, permalink } = item.data
              const parsedItem = { id: name, over_18, post_hint, src: undefined, permalink }
              // console.log('parsedItem:', parsedItem)
              if (item?.kind === 't3') {
                // if (over_18 && (post_hint === 'image' || post_hint === 'link')) {
                //   const { nfsw, obfuscated } = preview.images[0].variants
                //   const variant = nfsw || obfuscated
                //   parsedItem.src = variant.resolutions[variant.resolutions.length - 1].url
                // } else if (post_hint === 'image' || post_hint === 'link') {
                parsedItem.src = preview?.images[0].resolutions[preview.images[0].resolutions.length - 1].url
                // }
              }

              return parsedItem
            })

            setData((oldData) => ([
              ...oldData, ...newItems
            ]))
            setPending(false)
            // console.log('setPending:', pending)
          } catch (error) {
            console.log('error:', error)
            setError(error)
            setPending(false)
          }
        }
      })()
  }, [next, username, pending])

  function getMore() {
    // console.log('inside getMore')
    // console.log('pending:', pending)
    // if (!pending) {
    if (hasMore) {
      setNext(true)
    }
    // }
  }

  // console.log('in hook: pending:', pending)

  return [data, pending, getMore, error];
}
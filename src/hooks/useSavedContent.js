import { useState, useEffect, useRef } from "react";
import getCookie from '../utils/getCookie';
import * as reddit from '../services/reddit';

export default function useSavedContent() {
  const [data, setData] = useState([])
  const [username, setUsername] = useState()
  // console.log('username:', username)
  // const [more, setMore] = useState(true)
  const [next, setNext] = useState(false)

  const [options, setOptions] = useState({ after: undefined, count: undefined })
  const optionsRef = useRef()
  optionsRef.current = options

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // const access_tokenRef = useRef()
  // access_tokenRef.current = getCookie('access_token')

  // useEffect(() => {
  //   // console.log('useEffect access_tokenRef')
  //   ; (async () => {
  //     const access_token = access_tokenRef.current
  //     console.log('access_token:', access_token)
  //     if (!access_token) {
  //       console.log('useEffect refreshAccessToken')
  //       try {
  //         // setLoading(true)
  //         await reddit.refreshAccessToken()
  //         access_tokenRef.current = getCookie('access_token')
  //       } catch (error) {
  //         setError(error)
  //         setLoading(false)
  //       }
  //     }
  //   })()
  // })

  useEffect(() => {
    console.log('useEffect getMe')
      ; (async () => {
        try {
          let access_token = getCookie('access_token')
          if (!access_token) {
            await reddit.refreshAccessToken()
            access_token = getCookie('access_token')
          }
          const me = await reddit.getMe(access_token)
          setUsername(me.name)
          setLoading(false)
        } catch (error) {
          setError(error)
          setLoading(false)
        }
      })()
  }, [])

  useEffect(() => {
    // console.log('useEffect getSavedContent')
    ; (async () => {
      console.log('next:', next)
      console.log('username:', username)
      if (next && username) {
        try {
          setNext(false)
          console.log('useEffect getSavedContent: if next && username')
          let access_token = getCookie('access_token')
          if (!access_token) {
            await reddit.refreshAccessToken()
            access_token = getCookie('access_token')
          }
          const savedContent = await reddit.getSavedContent(access_token, username, optionsRef.current)
          // const fakeItems = await reddit.getFakeData()
          console.log('savedContent:', savedContent)

          const { after, dist: count } = savedContent.data
          setOptions({ after, count })

          const newItems = savedContent.data.children.map(item => {
            const { name, over_18, post_hint, preview } = item.data
            const parsedItem = { id: name, over_18, post_hint, src: undefined }
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
          // setLoading(false)

        } catch (error) {
          console.log('error:', error)
          setError(error)
          setLoading(false)
        }
      }
    })()
  }, [next, username])

  function getNext() {
    setNext(true)
  }

  return [data, getNext, loading, error];
}
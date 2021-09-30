import style from './Card.module.css'
import { useState, useEffect } from 'react';
import { ReactComponent as BookmarkIcon } from '../../svg//bookmark.svg';
// import Placeholder from '../Placeholder/Placeholder';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function Card({ item }) {
  // let imgSrc = null
  // const imgSrc = item?.preview?.images[0]?.resolutions[item?.preview?.images[0]?.resolutions.length - 1].url

  // const imgSrc = item?.image
  const [srcLoading, setSrcLoading] = useState(true)
  const [error, setError] = useState(null)

  // const onLoad = async () => {
  //   await new Promise(r => setTimeout(r, 2000))
  //   // console.log('onload img:', img.src)
  //   setSrcLoading(false)
  // }

  // useEffect(() => {

  //   const img = new Image()
  //   img.onload = async () => {
  //     await new Promise(r => setTimeout(r, 2000))
  //     // console.log('onload img:', img.src)
  //     setSrcLoading(false)
  //   }

  //   img.onerror = (error) => {
  //     console.log('img:', img.src)
  //     console.log('img.onerror:', error)
  //     setError(error)
  //     setSrcLoading(false)
  //   }

  //   img.src = item.src
  // }, [item.src])

  // if (error) {
  //   return (
  //     <div className={style.card}>
  //       <img alt="content failed to load" />
  //     </div>
  //   )
  // }

  // return (
  //   <div className={style.card} style={{ ...itemStyle }}>
  //     {srcLoading ?
  //       <div className={style.loading}>
  //         {/* //! shrinks when window resized */}
  //         <Placeholder width={photo.width} height={photo.height} />
  //       </div>
  //       :
  //       <>
  //         <img {...photo} alt="Reddit Content" />
  //         <div className={style.details}>
  //           hello
  //           <a href={photo.link}>a link</a>
  //         </div>
  //       </>
  //     }
  //   </div>
  // )

  return (
    <div className={style.card}>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.links}>
            <a href={item.sub}>sub link</a>
            &middot;
            <a href={item.author}>author author author author author</a>
          </div>
          <a className={style.title} href={item.post}>title</a>
        </div>
        <div className={style.bookmark}>
          <BookmarkIcon />
        </div>
      </div>

      {srcLoading &&
        <SkeletonTheme color="var(--grey)" highlightColor="var(--blue)">
          <Skeleton style={{ borderRadius: 0 }} height={item.height} />
        </SkeletonTheme>
      }

      <a href={item.post} target='_blank' rel="noreferrer"
        style={srcLoading ? { display: 'none' } : {}}>
        <img
          onLoad={async () => {
            await new Promise(r => setTimeout(r, 2000))
            // console.log('onload img:', img.src)
            setSrcLoading(false)
          }}
          src={item.src}
          alt="Reddit Content" />
      </a>
    </div>
  )
}
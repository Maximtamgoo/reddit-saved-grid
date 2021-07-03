import style from './MainPage.module.css';
import useSavedContent from '../../hooks/useSavedContent';
import useScrollEvent from '../../hooks/useScrollEvent';
import Gallery from '../../components/Gallery/Gallery';
import Navbar from '../../components/Navbar/Navbar';
// import { useCallback } from 'react';
// import reducer from '../../state/reducer';

export default function MainPage() {
  // console.log('MainPage')
  // const [list, setList] = useState([])

  const [data, pending, getMore, error] = useSavedContent()
  // console.log('pending:', pending)

  // const getMoreRef = useRef(getMore)


  function checkIfAtBottomThenGetMore() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log('%c AT BOTTOM ', 'color: red');
      // console.log('innerHeight + scrollY:', window.innerHeight + window.scrollY)
      // console.log('offsetHeight:', document.body.offsetHeight)
      getMore()
    }
  }

  useScrollEvent(checkIfAtBottomThenGetMore)

  // useEffect(() => {
  //   console.log('main page useEffect')
  //   checkIfAtBottomThenGetMore()
  // }, [checkIfAtBottomThenGetMore])

  if (error) {
    return (
      <div>
        {`${error}`}
      </div>
    )
  }

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

  return (
    <div className={style.main}>
      <Navbar />
      <Gallery list={data} />
      {pending && <div className={style.loader}>
        loading...
      </div>}
      {/* <button onClick={handle_nextSavedContent}>Next Saved Content</button> */}
    </div>
  )
}
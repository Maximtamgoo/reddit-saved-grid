import style from './MainPage.module.css';
import useSavedContent from '../../hooks/useSavedContent';
import Gallery from '../../components/Gallery/Gallery';
import Navbar from '../../components/Navbar/Navbar';

export default function MainPage() {
  console.log('MainPage')
  const [data, getNext, loading, error] = useSavedContent()
  // console.log('data:', data)

  if (error) {
    return (
      <div>
        {`${error}`}
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        MainPage Loading...
      </div>
    )
  }

  function handle_nextSavedContent() {
    getNext()
  }

  return (
    <div className={style.main}>
      <Navbar />
      <Gallery list={data} />
      {!loading && <div className={style.loader}>loading...</div>}
      {/* {!loading && <div className={style.loader}>End</div>} */}
      {/* <button onClick={handle_nextSavedContent}>Next Saved Content</button> */}
    </div>
  )
}
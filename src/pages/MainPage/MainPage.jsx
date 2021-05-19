import style from './MainPage.module.css';
import useSavedContent from '../../hooks/useSavedContent';
import GridView from '../../components/GridView/GridView';
import Navbar from '../../components/Navbar/Navbar';

// const fakeList = []
// for (let i = 0; i < 10; i++) {
//   fakeList.push({ id: i, thumbnail: `thumbnail ${i}` })
// }

// console.log('fakeList:', fakeList)

function MainPage() {
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
      <Navbar/>
      <GridView list={data} />
      <button onClick={handle_nextSavedContent}>Next Saved Content</button>
    </div>
  )
}

export default MainPage;
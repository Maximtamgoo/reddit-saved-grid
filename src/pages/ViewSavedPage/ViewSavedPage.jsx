import style from './ViewSavedPage.module.css';
import useSavedContent from '../../hooks/useSavedContent';
import GridView from '../../components/GridView/GridView';

// const fakeList = []
// for (let i = 0; i < 10; i++) {
//   fakeList.push({ id: i, thumbnail: `thumbnail ${i}` })
// }

// console.log('fakeList:', fakeList)

function ViewSavedPage() {
  console.log('ViewSavedPage')
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
        ViewSavedPage Loading...
      </div>
    )
  }

  function handle_nextSavedContent() {
    getNext()
  }

  function handle_SignOut() {
    console.log('handle_SignOut()')
  }

  return (
    <div className={style['view-saved-page']}>
      View Saved Page
      <GridView list={data} />
      <button onClick={handle_nextSavedContent}>Next Saved Content</button>
      <button onClick={handle_SignOut}>Sign Out</button>
    </div>
  )
}

export default ViewSavedPage;
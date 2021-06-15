import style from './GridView.module.css'
import Card from '../Card/Card'

function GridView({ list }) {

  return (
    <div className={style.grid_view}>
      {list.map(item => {
        // if (item.src === undefined) return null
        return (
          <Card key={item.id} id={item.id} over_18={item.over_18} permalink={item.permalink} imgSrc={item.src} />
        )
      })}
    </div>
  )
}

export default GridView;
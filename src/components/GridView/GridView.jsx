import style from './GridView.module.css'
import Card from '../Card/Card'

function GridView({ list }) {

  return (
    <div className={style['grid-view']}>
      {list.map(item => {
        return (
          <Card key={item.id} id={item.id}
            imgSrc={item.src} />
        )
      })}
    </div>
  )
}

export default GridView;
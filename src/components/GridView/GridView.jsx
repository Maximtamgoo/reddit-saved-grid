import style from './GridView.module.css'
import Card from '../Card/Card'

function GridView({ list }) {

  return (
    <div className={style['grid-view']}>
      {/* {list.map(item => {
        return (
          <Card
            key={item.id}
            cover={<img src={`${item.thumbnail}`} alt="thumbnail" />}
            hoverable
            size='small'
            style={{ width: 100, height: 100, zIndex: 5 }}
            actions={[<Button className={style['save-btn']}>Save</Button>]}
          >
              
          </Card>
        )
      })} */}

      {/* <Grid doubling columns={5}>
        {list.map(item => {
          return (
            <Grid.Column key={item.id}>
              <div className={style['card-wrapper']}>
                <Card raised>
                  <div className="trim">
                    <Image src={item.thumbnail} centered />
                  </div>
                  <Card.Content style={{ padding: '.1em' }}>
                    <Button compact color='blue' fluid>save</Button>
                  </Card.Content>
                </Card>
              </div>
            </Grid.Column>
          )
        })}
      </Grid> */}

      {list.map(item => {
        return (
          <Card key={item.id} imgSrc={item.thumbnail} />
        )
      })}

    </div>
  )
}

export default GridView;
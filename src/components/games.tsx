import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import React from 'react'
import { models } from '../types/index'

const Games = () => {
  const [games, setGames] = React.useState<Array<models.Game>>([])

  React.useEffect(() => {
    // setGames([{ host: 'a' }])
  }, [])

  return (
    <Card>
      <Card.Body>
        <h1>Games</h1>
        <hr />
        {
          games.map(v => {
            return (
              <Card className='my-2'>
                <Card.Body>
                  <div className='d-flex flex-row justify-content-between'>
                    <div>
                      <h3>Game</h3>
                      <h6>Host: {v.host}</h6>
                    </div>
                    <Button>Join</Button>
                  </div>
                </Card.Body>
              </Card>
            )
          })
        }
        {
          games.length === 0 && (
            <p className='w-100 text-center p-3'>No games found</p>
          )
        }
      </Card.Body>
    </Card>
  )
}

export default Games

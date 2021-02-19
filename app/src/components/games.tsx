import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import React from 'react'
import api from '../api'
import { models } from '../types/index'
import { useHistory } from 'react-router'

const Games = () => {
  const [games, setGames] = React.useState<Array<models.Game>>([])
  const history = useHistory()

  React.useEffect(() => {
    // setGames()
    api.get('/games')
      .then(data => {
        console.log(data)
        const _games: Array<models.Game> = data.data
        setGames(_games)
      })
      .catch(console.log)
  }, [])

  const navigate = (path: string) => {
    history.push('/game')
  }

  return (
    <Card>
      <Card.Body>
        <h1>Games</h1>
        <hr />
        {
          games.map((v, k) => {
            return (
              <Card key={k.toString()} className='my-2'>
                <Card.Body>
                  <div className='d-flex flex-row justify-content-between'>
                    <div>
                      <h3>Game</h3>
                      <h6>Host: {v.host}</h6>
                    </div>
                    <Button onClick={() => void navigate(`/game?id=${k}`)}>Join</Button>
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

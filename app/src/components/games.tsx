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
    history.push(path)
  }

  const createGame = () => {
    api.get('/game/create')
      .then(data => {
        console.log(data)
        const _game: models.Game = data.data
        history.push(`/game/${_game.id}`)
      })
      .catch(console.log)
  }

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-row justify-content-between">
          <h1>Games</h1>
          <Button onClick={createGame}>Create Game</Button>
        </div>
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
                    <Button onClick={() => void navigate(`/game/${k}`)}>Join</Button>
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

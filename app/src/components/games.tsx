import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import React from 'react'
import api from '../api'
import { models } from '../types/index'
import { useHistory } from 'react-router'

const Games = () => {
  const [games, setGames] = React.useState<Array<models.Game>>([])
  const [message, setMessage] = React.useState<string | null>('Loading...')
  const history = useHistory()

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

  const refresh = () => {
    setMessage('Refreshing...')
    api.get('/games')
      .then(data => {
        console.log(data)
        const _games: Array<models.Game> = data.data
        setGames(_games)
      })
      .catch(console.log)
      .finally(() => {
        setMessage(null)
      })
  }

  React.useEffect(() => {
    refresh()
  }, [])

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-row justify-content-between">
          <h1>Games ({games.length})</h1>
          <div className="d-flex flex-ro">
            <Button onClick={createGame} className='btn-success mx-3'>Create Game</Button>
            <Button onClick={refresh}>Refresh</Button>
          </div>
        </div>
        <p className='text-muted text-center w-100'>{message}</p>
        <hr />
        {
          games.map((v, k) => {
            const host = v.host || { id: '0', name: 'none', address: 'none' }
            return (
              <Card key={k.toString()} className='my-2'>
                <Card.Header>
                  <h3>ID: {v.id}</h3>
                </Card.Header>
                <Card.Body>
                  <div className='d-flex flex-row justify-content-between'>
                    <div>
                      <p><b>Host:</b> {host.name} - {host.address}</p>
                      {v.full && (
                        <p className='text-danger'><b>FULL</b></p>
                      )}
                    </div>
                    <div>
                      <Button onClick={() => void navigate(`/game/${v.id}`)} className='p-4'>Join</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          })
        }
        {games.length === 0 && (
          <p className='w-100 text-center p-3'>No games found</p>
        )}
      </Card.Body>
    </Card>
  )
}

export default Games

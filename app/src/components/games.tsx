import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import FormControl from 'react-bootstrap/FormControl'
import React from 'react'
import api from '../api'
import { model } from '../types/index'
import { useHistory } from 'react-router'

export const Games = () => {
  const [games, setGames] = React.useState<Array<model.IGame>>([])
  const [message, setMessage] = React.useState<string | null>('Loading...')
  const [filter, setFilter] = React.useState<string>('')
  const history = useHistory()

  const navigate = (path: string) => {
    history.push(path)
  }

  const createGame = () => {
    api
      .get('/game/create')
      .then((data) => {
        console.log(data)
        const _game: model.IGame = data.data
        history.push(`/game/${_game.id}`)
      })
      .catch(console.log)
  }

  const refresh = () => {
    setMessage('Refreshing...')
    api
      .get('/games')
      .then((data) => {
        console.log(data)
        const _games: Array<model.IGame> = data.data
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

  const filteredGames = games.filter(
    (f) =>
      filter.length === 0 ||
      `${f.host.name} ${f.id}`.match(new RegExp(filter, 'g'))
  )

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-row justify-content-between">
          <h1>Games ({filteredGames.length})</h1>
          <div className="d-flex flex-ro">
            <Button onClick={createGame} className="btn-success mx-3">
              Create Game
            </Button>
            <Button disabled={message !== null} onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-muted text-center w-100">{message}</p>
        <hr />
        <FormControl
          onChange={(event) => setFilter(event.target.value)}
          value={filter}
          placeholder="Search"
          className="text-center"
        />
        {filteredGames.map((v, k) => {
          const host = v.host || { id: '0', name: 'none', address: 'none' }
          return (
            <Card key={k.toString()} className="my-2">
              <Card.Header>
                <h3>ID: {v.id}</h3>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-row justify-content-between">
                  <div>
                    <p>
                      <b>Host:</b> {host.name}
                    </p>
                    {v.full && (
                      <p className="text-danger">
                        <b>FULL</b>
                      </p>
                    )}
                  </div>
                  <div>
                    <Button
                      disabled={v.full}
                      onClick={() => void navigate(`/game/${v.id}`)}
                      className="p-4">
                      Join
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )
        })}
        {filteredGames.length === 0 && (
          <p className="w-100 text-center p-3">No games found</p>
        )}
      </Card.Body>
    </Card>
  )
}

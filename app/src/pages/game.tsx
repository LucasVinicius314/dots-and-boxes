import React from 'react'
import { model } from '../types/index'
import socketIOClient from 'socket.io-client'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'

const Game = () => {
  const [game, setGame] = React.useState<model.IGame | undefined>(undefined)
  const params: { id: string } = useParams()
  const history = useHistory()
  React.useEffect(() => {
    const name = prompt('Your name:', 'Unknown') || 'Unknown'
    const socket = socketIOClient.io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`, {
      withCredentials: true,
      query: {
        id: params.id,
        name: name,
        playerId: sessionStorage.getItem('id') || '',
      },
    })
    socket.on('game info', (data: model.IGame) => {
      console.log('Connected')
      console.log(data)
      setGame(data)
    })
    socket.on('game error', (data: string) => {
      console.log(data)
      alert(data)
      history.push('/')
    })
  }, [])

  return (
    <div className='py-4'>
      <h1>Game</h1>
      <p><b>ID:</b> {game?.id || 'none'}</p>
      <p><b>Host:</b> {game?.host?.name || 'none'} - {game?.host?.address || 'none'}</p>
      <p><b>Opponent:</b> {game?.opponent?.name || 'none'} - {game?.opponent?.address || 'none'}</p>
      {game?.full && (
        <p className='text-danger'><b>FULL</b></p>
      )}
    </div>
  )
}

export default Game

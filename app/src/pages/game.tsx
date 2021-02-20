import React from 'react'
import socketIOClient from 'socket.io-client'
import { useParams } from 'react-router-dom'

const Game = () => {
  const params: { id: string } = useParams()
  React.useEffect(() => {
    const socket = socketIOClient.io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`, {
      withCredentials: true,
      query: {
        id: params.id,
      },
    })
    socket.on('join', () => {
      alert(`Joining game... ID: ${params.id}`)
      console.log('Connected')
    })
  }, [params.id])

  return (
    <div>
      <h1>Game</h1>
    </div>
  )
}

export default Game

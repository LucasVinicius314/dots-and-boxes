import React from 'react'
import socketIOClient from 'socket.io-client'

const Game = () => {
  React.useEffect(() => {
    const socket = socketIOClient.io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`, {
      withCredentials: true,
    })
    socket.on('call', () => {
      alert('Test')
    })
  }, [])

  return (
    <div>
      <h1>Game</h1>
    </div>
  )
}

export default Game

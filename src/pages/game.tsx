import React from 'react'
import socketIOClient from 'socket.io-client'

const Game = () => {
  React.useEffect(() => {
    const socket = socketIOClient.io('http://localhost:4001', {
      withCredentials: true,
    })
    socket.on('call', () => {
      alert('con')
    })
  }, [])

  return (
    <div>
      <h1>Game</h1>
    </div>
  )
}

export default Game

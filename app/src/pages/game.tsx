import React from 'react'
import socketIOClient from 'socket.io-client'

const Game = () => {
  React.useEffect(() => {
    const socket = socketIOClient.io(`${process.env.REACT_APP_HOST}:${process.env.PORT || 80}`, {
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

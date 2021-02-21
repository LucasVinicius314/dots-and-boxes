import React from 'react'
import { model } from '../types/index'
import socketIOClient from 'socket.io-client'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'

const Game = () => {
  const [game, setGame] = React.useState<model.IGame | undefined>(undefined)
  const params: { id: string } = useParams()
  const history = useHistory()
  const [socket, setSocket] = React.useState<socketIOClient.Socket | undefined>(undefined)

  React.useEffect(() => {
    const name = prompt('Your name:', 'Unknown') || 'Unknown'
    const _socket = socketIOClient.io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`, {
      withCredentials: true,
      query: {
        id: params.id,
        name: name,
        playerId: sessionStorage.getItem('id') || '',
      },
    })
    _socket.on('game info', (data: model.IGame) => {
      console.log('Connected')
      console.log(data)
      setGame(data)
    })
    _socket.on('game message', (data: string) => {
      console.log(data)
      alert(data)
    })
    _socket.on('game error', (data: string) => {
      console.log(data)
      alert(data)
      history.push('/')
    })
    setSocket(_socket)
  }, [])

  const send = (x: number, y: number) => {
    const args: model.IPlayArgs = {
      playerId: sessionStorage.getItem('id') || '',
      gameId: game?.id || '0',
      x: x,
      y: y,
    }
    socket?.emit('play', args)
  }

  const color = (_state: 'empty' | 'host' | 'opponent') => {
    switch (_state) {
      case 'empty':
        return '#ddd'
      case 'host':
        return '#944'
      case 'opponent':
        return '#449'
    }
  }

  const height = game?.height || 4
  const width = game?.width || 4

  const boxSize = 40
  const spaceSize = 10

  const tiles = game?.tiles

  return (
    <div className='py-4'>
      <h1>Game</h1>
      <p><b>ID:</b> {game?.id || 'none'}</p>
      <p><b>Host:</b> {game?.host?.name || 'none'}</p>
      <p><b>Opponent:</b> {game?.opponent?.name || 'none'}</p>
      {game?.full && (
        <p className='text-danger'><b>FULL</b></p>
      )}
      <hr />
      <div className="d-flex justify-content-center align-items-center p-3">
        <div style={{
          width: width * boxSize + (width + 1) * spaceSize,
          height: height * boxSize + (height + 1) * spaceSize,
          borderWidth: spaceSize,
          borderColor: 'black',
          borderStyle: 'solid',
        }}>
          {tiles?.map((v, k) => (
            <div key={k} className='d-flex flex-row'>
              {v.map((v2, k2) => {
                switch (v2.type) {
                  case 'box':
                    return <div style={{ width: boxSize, height: boxSize }}></div>
                  case 'horizontal':
                    return <div onClick={() => send(k, k2)} style={{ width: boxSize, height: spaceSize, backgroundColor: color(v2.state) }}></div>
                  case 'vertical':
                    return <div onClick={() => send(k, k2)} style={{ width: spaceSize, height: boxSize, backgroundColor: color(v2.state) }}></div>
                  case 'space':
                    return <div style={{ width: spaceSize, height: spaceSize }}></div>
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Game

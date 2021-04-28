import React from 'react'
import { model } from '../types/index'
import socketIOClient from 'socket.io-client'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'

const colors = {
  blue: '#449',
  gray: '#eee',
  red: '#944',
  lightBlue: '#99e',
  lightRed: '#e99',
  white: '#fff',
}

export const Game = () => {
  const [message, setMessage] = React.useState<string>('')
  const [game, setGame] = React.useState<model.IGame | undefined>(undefined)
  const [socket, setSocket] = React.useState<socketIOClient.Socket | undefined>(
    undefined
  )

  const params: { id: string } = useParams()
  const history = useHistory()

  const tiles = game?.tiles

  const height = game?.height || 0
  const width = game?.width || 0

  const boxSize = 40
  const spaceSize = 10

  React.useEffect(() => {
    const name = prompt('Your name:', 'Unknown') || 'Unknown'
    const _socket = socketIOClient.io(
      `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}`,
      {
        withCredentials: true,
        query: {
          id: params.id,
          name: name,
          playerId: sessionStorage.getItem('id') || '',
        },
      }
    )
    _socket.on('game info', (data: model.IGame) => {
      console.log('Connected')
      console.log(data)
      setGame(data)
    })
    _socket.on('game message', (data: string) => {
      console.log(data)
      setMessage(data)
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

  const lineColor = (_state: 'empty' | 'host' | 'opponent') => {
    switch (_state) {
      case 'empty':
        return colors.gray
      case 'host':
        return colors.red
      case 'opponent':
        return colors.blue
    }
  }

  const boxColor = (_state: 'empty' | 'host' | 'opponent') => {
    switch (_state) {
      case 'empty':
        return colors.white
      case 'host':
        return colors.lightRed
      case 'opponent':
        return colors.lightBlue
    }
  }

  return (
    <div className="py-4">
      <h1>Game</h1>
      <p>
        <b>ID:</b> {game?.id || 'none'}
      </p>
      <p style={{ color: colors.red }}>
        <b>Host:</b> {game?.host?.name || 'none'}
      </p>
      <p style={{ color: colors.blue }}>
        <b>Opponent:</b> {game?.opponent?.name || 'none'}
      </p>
      {game?.full && (
        <p className="text-danger">
          <b>FULL</b>
        </p>
      )}
      <hr />
      <div className="d-flex flex-column justify-content-center align-items-center p-3">
        <div className="align-items-center mb-4">
          {game?.status === 'running' && (
            <h2
              className="text-center"
              style={{
                color: game?.waitingMove === 'host' ? colors.red : colors.blue,
              }}>
              {game[game.waitingMove].name}'s turn
            </h2>
          )}
          {game?.status === 'waiting' && (
            <h2 className="text-center">Waiting for an opponent to join</h2>
          )}
          {true && <h2 className="text-center">{message}</h2>}
        </div>
        <div
          style={{
            width: width * boxSize + (width + 1) * spaceSize,
            height: height * boxSize + (height + 1) * spaceSize,
            borderWidth: spaceSize,
            borderColor: 'black',
            borderStyle: 'solid',
          }}>
          {tiles?.map((v, k) => (
            <div key={k} className="d-flex flex-row">
              {v.map((v2, k2) => {
                const key = k2 + k * v.length
                switch (v2.type) {
                  case 'box':
                    return (
                      <div
                        key={key}
                        style={{
                          width: boxSize,
                          height: boxSize,
                          backgroundColor: boxColor(v2.state),
                        }}></div>
                    )
                  case 'horizontal':
                    return (
                      <div
                        key={key}
                        onClick={() => send(k, k2)}
                        style={{
                          width: boxSize,
                          height: spaceSize,
                          backgroundColor: lineColor(v2.state),
                        }}></div>
                    )
                  case 'vertical':
                    return (
                      <div
                        key={key}
                        onClick={() => send(k, k2)}
                        style={{
                          width: spaceSize,
                          height: boxSize,
                          backgroundColor: lineColor(v2.state),
                        }}></div>
                    )
                  case 'space':
                    return (
                      <div
                        key={key}
                        style={{
                          width: spaceSize,
                          height: spaceSize,
                          backgroundColor: '#555',
                        }}></div>
                    )
                  default:
                    return (
                      <div
                        key={key}
                        style={{
                          width: spaceSize,
                          height: spaceSize,
                          backgroundColor: '#555',
                        }}></div>
                    )
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

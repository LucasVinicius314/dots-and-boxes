import 'dotenv/config'

import * as Model from './model'

import Server from './server'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { model } from '../app/src/types/index'
import path from 'path'
import routes from './routes'
import socketIo from 'socket.io'

__dirname = __dirname.replace(/[\\\/]build/, '')

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'app/build')))
app.use(routes)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'app/build', 'index.html'))
})

const server = http.createServer(app)
//@ts-ignore
const io: socketIo.Socket = socketIo(server, {
  cors: {
    origin: `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_PORT}`,
    credentials: true,
  },
})

io.on('connection', (socket: socketIo.Socket) => {
  console.log('new client connected')
  const query: model.IGameQuery = (socket.handshake
    .query as unknown) as model.IGameQuery
  const foundPlayer = Server.players.find((f) => f.id === query.playerId)
  if (foundPlayer !== undefined) {
    foundPlayer.address = socket.handshake.address
    foundPlayer.name = query.name
    foundPlayer.socket = socket
    const foundGame: Model.Game = Server.games.find((f) => f.id === query.id)
    if (foundGame !== undefined) {
      console.log('game found, joining')
      if (foundGame.host === undefined) {
        console.log('host set')
        foundGame.host = foundPlayer
        const response: Model.WeakGame = foundGame.toWeak()
        foundGame.emit('game info', response)
        console.log(foundGame)
      } else if (foundGame.opponent === undefined) {
        console.log('opponent set')
        foundGame.opponent = foundPlayer
        foundGame.full = true
        foundGame.status = 'running'
        foundGame.waitingMove = 'host'
        const response: Model.WeakGame = foundGame.toWeak()
        foundGame.emit('game info', response)
        console.log(foundGame)
      } else {
        console.log('the game is full')
        socket.emit('game error', 'The game is full')
      }
    }
  } else {
    console.log('game not found')
    socket.emit('game error', 'Game not found')
  }
  socket.on('play', (args: model.IPlayArgs) => {
    console.log('play')
    console.log(args)
    const foundGame = Server.games.find((f) => f.id === args.gameId)
    if (foundGame !== undefined) {
      console.log('play - game found')
      const foundPlayer = [foundGame.host, foundGame.opponent].find(
        (f) => f.id === args.playerId
      )
      if (foundPlayer !== undefined) {
        console.log('play - user found')
        if (foundGame.status === 'running') {
          console.log('play - game is runnung')
          const waitedPlayer =
            foundPlayer.id === foundGame[foundGame.waitingMove]?.id
          if (waitedPlayer) {
            console.log('play - play made')
            const targetTile = foundGame.tiles[args.x][args.y]
            if (targetTile.state === 'empty') {
              targetTile.state = foundGame.waitingMove
              const check = foundGame.check()
              const response: Model.WeakGame = foundGame.toWeak()
              if (check.over) {
                foundGame.emit('game info', response)
                foundGame.emit('game message', check.message)
              } else {
                if (foundGame.waitingMove === 'host') {
                  foundGame.waitingMove = 'opponent'
                } else if (foundGame.waitingMove === 'opponent') {
                  foundGame.waitingMove = 'host'
                }
                foundGame.emit('game info', response)
              }
            } else {
              console.log('play - tile is not empty')
              socket.emit('game message', 'That move was made already')
            }
          } else {
            console.log('play - play from wrong player')
            socket.emit('game message', "It's not your turn")
          }
        } else {
          console.log('play - game is waiting')
          socket.emit('game message', 'The game is waiting to start')
        }
      } else {
        console.log('play - user not found')
        socket.emit('game message', 'Your user is invalid')
      }
    } else {
      console.log('play - game not found')
      socket.emit('game message', "The game ended or wasn't found")
    }
  })
  socket.on('disconnect', () => {
    console.log('client disconnected')
  })
})

server.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})

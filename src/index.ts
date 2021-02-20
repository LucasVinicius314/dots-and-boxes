import * as Model from './model'

import Server from './server'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { model } from '../app/src/types/index'
import path from 'path'
import routes from './routes'
import socketIo from 'socket.io'
import uniqid from 'uniqid'

dotenv.config()

const PORT = process.env.PORT

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
const io = socketIo(server, {
  cors: {
    origin: `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_PORT}`,
    credentials: true,
  },
})

io.on('connection', (socket: socketIo.Socket) => {
  const query: model.IGameQuery = socket.handshake.query as unknown as model.IGameQuery
  const player: Model.Player = new Model.Player({
    id: uniqid(),
    address: socket.handshake.address,
    name: query.name,
    socket: socket,
  })
  console.log('new client connected', player)
  Server.players.push(player)
  const foundGame: Model.Game = Server.games.find(f => f.id === query.id)
  if (foundGame !== undefined) {
    console.log('game found, joining')
    if (foundGame.host === undefined) {
      console.log('host set')
      foundGame.host = player
      const response: Model.WeakGame = foundGame.toWeak()
      foundGame.emit('game info', response)
      console.log(foundGame)
    } else if (foundGame.opponent === undefined) {
      console.log('opponent set')
      foundGame.opponent = player
      foundGame.full = true
      const response: Model.WeakGame = foundGame.toWeak()
      foundGame.emit('game info', response)
      console.log(foundGame)
    } else {
      console.log('the game is full')
      socket.emit('game error', 'The game is full')
    }
  }
  socket.on('disconnect', () => {
    console.log('client disconnected', player)
  })
})

server.listen(PORT, () => console.log(`listening on port ${PORT}`))

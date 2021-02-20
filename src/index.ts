import Server from './server'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { models } from '../app/src/types/index'
import path from 'path'
import routes from './routes'
import socketIo from 'socket.io'
import uniqid from 'uniqid'

dotenv.config()

const PORT = process.env.PORT

__dirname = __dirname.replace(/[\\\/]build/, '')

const app = express()
app.use(cors())
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
  const player: models.Player = {
    id: uniqid(),
    address: socket.handshake.address,
    name: 'Unknown',
  }
  console.log(`New client connected - ${JSON.stringify(player)}`)
  socket.emit('join', 'true')
  Server.players.push(player)
  const query: models.GameQuery = socket.handshake.query as unknown as models.GameQuery
  // socket.on('disconnect', () => {
  //   console.log(`Client disconnected - ${socket.handshake.address}`)
  // })
  socket.on('disconnect', () => {
    console.log(`Client disconnected - ${JSON.stringify(player)}`)
  })
  console.log(Server.players)
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

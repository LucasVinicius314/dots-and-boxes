import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import path from 'path'
import socketIo from 'socket.io'

dotenv.config()

const port = process.env.PORT
// const index = require('./routes')

__dirname = __dirname.replace(/\\build/, '')

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'app/build')))
// app.use(index)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'app/build', 'index.html'))
})

const server = http.createServer(app)
//@ts-ignore
const io = socketIo(server, {
  cors: {
    origin: `${process.env.REACT_APP_HOST}:${port}`,
    credentials: true,
  },
})

io.on('connection', (socket: socketIo.Socket) => {
  console.log('New client connected')
  getApiAndEmit(socket)
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const getApiAndEmit = (socket: socketIo.Socket) => {
  const response = new Date()
  socket.emit('call', response)
}

server.listen(port, () => console.log(`Listening on port ${port}`))

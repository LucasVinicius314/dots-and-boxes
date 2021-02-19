import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import path from 'path'
import routes from './routes'
import socketIo from 'socket.io'

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
  console.log('New client connected')
  socket.emit('call', 'test')
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

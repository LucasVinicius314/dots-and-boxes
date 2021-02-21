import * as Model from './model'

import Server from './server'
import { Socket } from 'socket.io'
import express from 'express'
import { model } from '../app/src/types/index'
import uniqid from 'uniqid'

const router = express.Router()

const userBind = (req: express.Request, res: express.Response) => {
  const id = uniqid()
  const player: Model.Player = new Model.Player({
    address: 'unset',
    id: id,
    name: 'unset',
    socket: undefined,
  })
  Server.players.push(player)
  const response: model.IBindQuery = { id: id }
  res.status(200).json(response)
}

router.get('/api/user/bind', (req, res) => {
  console.log('user binding')
  userBind(req, res)
})

router.get('/api/user/verify/:id', (req, res) => {
  console.log('user verify')
  const params: model.IVerifyRequest = req.params as unknown as model.IVerifyRequest
  if (Server.players.find(f => f.id === params.id) !== undefined) {
    const response: model.IRequest = { message: 'User verified' }
    res.status(200).json(response)
  } else {
    const response: model.IRequest = { message: 'User not found' }
    res.status(400).json(response)
  }
})

router.get('/api/games', (req, res) => {
  console.log('game listing')
  const games = Server.games.map(v => v.toWeak())
  res.status(200).json(games)
})

router.get('/api/game/create', (req, res) => {
  console.log('game creation')
  const size = 4 + Math.ceil(Math.random() * 3) * 2
  const game: Model.Game = new Model.Game({
    full: false,
    host: undefined,
    id: uniqid(),
    opponent: undefined,
    height: size,
    width: size,
    status: 'waiting',
    waitingMove: 'host',
  })
  Server.games.push(game)
  res.status(200).json(game)
})

export default router

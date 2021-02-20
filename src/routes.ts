import * as Model from './model'

import Server from './server'
import express from 'express'
import { model } from '../app/src/types/index'
import uniqid from 'uniqid'

const router = express.Router()

router.get('/api/games', (req, res) => {
  console.log('game listing')
  const games = Server.games.map(v => v.toWeak())
  res.json(games).status(200)
})

router.get('/api/game/create', (req, res) => {
  console.log('game creation')
  const game: Model.Game = new Model.Game({
    full: false,
    host: undefined,
    id: uniqid(),
    opponent: undefined,
  })
  Server.games.push(game)
  res.json(game).status(200)
})

export default router

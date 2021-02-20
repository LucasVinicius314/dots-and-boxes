import Server from './server'
import express from 'express'
import { models } from '../app/src/types/index'
import uniqid from 'uniqid'

const router = express.Router()

router.get('/api/games', (req, res) => {
  console.log('game listing')
  const games = Server.games

  res.json(games).status(200)
})

router.get('/api/game/create', (req, res) => {
  console.log('game creation')
  const game: models.Game = {
    id: uniqid(),
    host: 'Unknown',
  }

  Server.games.push(game)

  res.json(game).status(200)
})

export default router

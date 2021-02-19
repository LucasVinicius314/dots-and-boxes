import express from 'express'
import { models } from '../app/src/types/index'

const router = express.Router()

router.get('/api/games', (req, res) => {
  const response: Array<models.Game> = [
    { host: 'Sure' },
    { host: 'Someone' },
    { host: 'Anonymous' },
  ]

  res.json(response).status(200)
})

export default router

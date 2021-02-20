import { models } from '../app/src/types/index'

class GameManager implements models.Game {
  id: string
  host: models.Player
  opponent: models.Player
  full: boolean
}

export default GameManager

import { models } from '../app/src/types/index'

class GameManager implements models.Game {
  id: string
  host: string
  players: Array<models.Player>
}

export default GameManager
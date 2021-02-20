import { model } from '../app/src/types/index'

class GameManager implements model.IGame {
  id: string
  host: model.IPlayer
  opponent: model.IPlayer
  full: boolean
}

export default GameManager

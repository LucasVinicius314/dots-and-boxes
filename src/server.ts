import * as Model from './model'

import { model } from '../app/src/types/index'

class Server {
  static players: Array<Model.Player> = []
  static games: Array<Model.Game> = []
}

export default Server

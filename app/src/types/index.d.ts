/* eslint-disable @typescript-eslint/no-unused-vars */

import { Socket } from 'socket.io'

export namespace models {
  interface Game {
    id: string
    host: Player
    opponent: Player
    full: boolean
  }

  interface GameQuery {
    id: string
    EIO: string
    transport: string
    t: string
  }

  interface Player {
    id: string
    name: string
    address: string
    socket?: Socket
  }
}

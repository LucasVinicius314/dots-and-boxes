/* eslint-disable @typescript-eslint/no-unused-vars */

import { Socket } from 'socket.io'

export namespace model {
  interface IGame {
    full: boolean
    host: IPlayer
    id: string
    opponent: IPlayer
  }

  interface IWeakGame {
    full: boolean
    host: IWeakPlayer
    id: string
    opponent: IWeakPlayer
  }

  interface IGameQuery {
    EIO: string
    id: string
    name: string
    t: string
    transport: string
  }

  interface IPlayer {
    address: string
    id: string
    name: string
    socket: Socket
  }

  interface IWeakPlayer {
    address: string
    id: string
    name: string
  }
}

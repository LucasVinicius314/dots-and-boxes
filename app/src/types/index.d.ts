/* eslint-disable @typescript-eslint/no-unused-vars */

import { Socket } from 'socket.io'

export namespace model {
  interface IPlayArgs {
    playerId: string
    gameId: string
    x: number
    y: number
  }

  interface IRequest {
    message: string
  }

  interface ITile {
    type: 'vertical' | 'horizontal' | 'box' | 'space'
    state: 'empty' | 'host' | 'opponent'
  }

  interface IGame {
    full: boolean
    host: IPlayer
    id: string
    opponent: IPlayer
    tiles?: Array<Array<ITile>>
    width: number
    height: number
    status: 'running' | 'waiting'
    waitingMove: 'host' | 'opponent'
  }

  interface IWeakGame {
    full: boolean
    host: IWeakPlayer
    id: string
    opponent: IWeakPlayer
    tiles: Array<Array<ITile>>
  }

  interface IVerifyRequest {
    id: string
  }

  interface IBindQuery {
    id: string
  }

  interface IBindResponse {
    message: string
  }

  interface IGameQuery {
    EIO: string
    id: string
    name: string
    playerId: string
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

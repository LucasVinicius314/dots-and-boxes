/* eslint-disable @typescript-eslint/no-unused-vars */

import { Socket } from 'socket.io'

export namespace model {
  interface IRequest {
    message: string
  }

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

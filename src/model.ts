import { Socket } from 'socket.io'
import { model } from '../app/src/types/index'

class Player implements model.IPlayer {
  address: string
  id: string
  name: string
  socket: Socket

  constructor(params: model.IPlayer) {
    this.address = params.address
    this.id = params.id
    this.name = params.name
    this.socket = params.socket
  }

  toWeak(): WeakPlayer {
    return new WeakPlayer({
      address: this.address,
      id: this.id,
      name: this.name,
    })
  }
}

class WeakPlayer implements model.IWeakPlayer {
  address: string
  id: string
  name: string

  constructor(params: WeakPlayer) {
    this.address = params.address
    this.id = params.id
    this.name = params.name
  }

  static empty: WeakPlayer = {
    address: 'none',
    id: '0',
    name: 'none'
  }
}

class Game implements model.IGame {
  full: boolean
  host: Player
  id: string
  opponent: Player

  constructor(params: model.IGame) {
    this.full = params.full
    this.host = params.host as Player
    this.id = params.id
    this.opponent = params.opponent as Player
  }

  toWeak(): WeakGame {
    return new WeakGame({
      full: this.full,
      host: this.host?.toWeak() || WeakPlayer.empty,
      id: this.id,
      opponent: this.opponent?.toWeak() || WeakPlayer.empty,
    })
  }

  emit(ev: string, ...args: any[]): boolean {
    const host = this.host?.socket.emit(ev, ...args)
    const opponent = this.opponent?.socket.emit(ev, ...args)
    return host && opponent
  }
}

class WeakGame implements model.IWeakGame {
  full: boolean
  host: WeakPlayer
  id: string
  opponent: WeakPlayer

  constructor(params: WeakGame) {
    this.full = params.full
    this.host = params.host
    this.id = params.id
    this.opponent = params.opponent
  }
}

export {
  Player,
  WeakPlayer,
  Game,
  WeakGame,
}

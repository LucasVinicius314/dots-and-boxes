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

class Tile implements model.ITile {
  type: 'vertical' | 'horizontal' | 'box' | 'space'
  state: 'empty' | 'host' | 'opponent'

  constructor(params: model.ITile) {
    this.state = params.state
    this.type = params.type
  }

  static default: Array<Array<Tile>>
}

class Game implements model.IGame {
  full: boolean
  host: Player
  id: string
  opponent: Player
  tiles: Array<Array<Tile>>

  constructor(params: model.IGame) {
    this.full = params.full
    this.host = params.host as Player
    this.id = params.id
    this.opponent = params.opponent as Player
    const height = 3
    const width = 4
    const even = (v, k) => k % 2 === 0 ? new Tile({ type: 'box', state: 'empty' }) : new Tile({ type: 'vertical', state: 'empty' })
    const odd = (v, k) => k % 2 === 0 ? new Tile({ type: 'horizontal', state: 'empty' }) : new Tile({ type: 'space', state: 'empty' })
    this.tiles = new Array((height * 2) - 1).fill(true)
      .map((v, k) => new Array((width * 2) - 1).fill(true)
        .map(k % 2 === 0 ? even : odd))
    /* (() => {
      const height = 3
      const width = 4
      const even = (v, k) => k % 2 === 0 ? ' ' : '|'
      const odd = (v, k) => k % 2 === 0 ? '-' : '+'
      const tiles = new Array((height * 2) - 1).fill(true).map((v, k) => new Array((width * 2) - 1).fill(true).map(k % 2 === 0 ? even : odd))
      console.log(tiles)
    })() */
  }

  toWeak(): WeakGame {
    return new WeakGame({
      full: this.full,
      host: this.host?.toWeak() || WeakPlayer.empty,
      id: this.id,
      opponent: this.opponent?.toWeak() || WeakPlayer.empty,
      tiles: this.tiles
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
  tiles: Array<Array<Tile>>

  constructor(params: WeakGame) {
    this.full = params.full
    this.host = params.host
    this.id = params.id
    this.opponent = params.opponent
    this.tiles = params.tiles
  }
}

export {
  Player,
  WeakPlayer,
  Game,
  WeakGame,
}

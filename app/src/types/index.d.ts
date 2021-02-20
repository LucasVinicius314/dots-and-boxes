/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace models {
  interface Game {
    id: string
    host: string
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
  }
}
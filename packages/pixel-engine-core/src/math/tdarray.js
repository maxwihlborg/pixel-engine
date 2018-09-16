export const SHAPE = 0
export const DATA = 1
export const WIDTH = 0
export const HEIGHT = 1

const tdarray = {
  SHAPE: 0,
  DATA: 1,
  WIDTH: 0,
  HEIGHT: 1,

  create(data, shape) {
    return [shape, data]
  },
  width(n) {
    return n[SHAPE][WIDTH]
  },
  height(n) {
    return n[SHAPE][HEIGHT]
  },
  get(n, x, y) {
    return n[DATA][x + y * n[SHAPE][WIDTH]]
  },
  set(n, x, y, v) {
    n[DATA][x + y * n[SHAPE][WIDTH]] = v
    return n
  },
  index(n, x, y) {
    return x + y * n[SHAPE][WIDTH]
  },
}

export default tdarray

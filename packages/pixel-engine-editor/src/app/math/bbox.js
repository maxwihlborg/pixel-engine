export const X = 0
export const Y = 1
export const WIDTH = 2
export const HEIGHT = 3

const bbox = {
  x(b) {
    return b[X]
  },
  y(b) {
    return b[Y]
  },
  width(b) {
    return b[WIDTH]
  },
  height(b) {
    return b[HEIGHT]
  },
  create(x, y, width, height) {
    return [x, y, width, height]
  },
  has(b, v) {
    return b[X] <= v[X] && v[X] < b[WIDTH] && b[Y] <= v[Y] && v[Y] < b[HEIGHT]
  },
}

export default bbox

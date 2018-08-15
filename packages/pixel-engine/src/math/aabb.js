export const X = 0
export const Y = 1
export const WIDTH = 2
export const HEIGHT = 3

const aabb = {
  x(r) {
    return r[X]
  },

  y(r) {
    return r[Y]
  },

  width(r) {
    return r[WIDTH]
  },

  height(r) {
    return r[HEIGHT]
  },

  create(x, y, width, height) {
    return [x, y, width, height]
  },

  clone(r) {
    return [r[X], r[Y], r[WIDTH], r[HEIGHT]]
  },

  set(r, w) {
    r[X] = w[X]
    r[Y] = w[Y]
    r[WIDTH] = w[WIDTH]
    r[HEIGHT] = w[HEIGHT]
    return r
  },

  topLeft(r) {
    return [r[X], r[Y]]
  },

  topRight(r) {
    return [r[X] + r[WIDTH], r[Y]]
  },

  bottomLeft(r) {
    return [r[X], r[Y] + r[HEIGHT]]
  },

  bottomRight(r) {
    return [r[X] + r[WIDTH], r[Y] + r[HEIGHT]]
  },

  scl(r, x, y = x) {
    r[WIDTH] *= x
    r[HEIGHT] *= y
    return r
  },

  pos(r, v) {
    r[X] = v[X]
    r[Y] = v[Y]
    return r
  },

  translate(r, v) {
    r[X] = r[X] + v[X]
    r[Y] = r[Y] + v[Y]
    return r
  },

  has(r, v) {
    return (
      r[X] < v[X] &&
      v[X] < r[X] + r[WIDTH] &&
      r[Y] < v[Y] &&
      v[Y] < r[Y] + r[HEIGHT]
    )
  },

  intersect(r, w) {
    return (
      r[X] < w[X] + w[WIDTH] &&
      w[X] < r[X] + r[WIDTH] &&
      r[Y] < w[Y] + w[HEIGHT] &&
      w[Y] < r[Y] + r[HEIGHT]
    )
  },
}

export default aabb

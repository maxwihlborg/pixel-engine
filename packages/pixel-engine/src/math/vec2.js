export const X = 0
export const Y = 0

const vec2 = {
  x(r) {
    return r[X]
  },

  y(r) {
    return r[Y]
  },

  create(x = 0, y = 0) {
    return [x, y]
  },

  clone(r) {
    return [r[X], r[Y]]
  },

  set(r, v) {
    r[X] = v[X]
    r[Y] = v[Y]
    return r
  },

  add(r, v) {
    r[X] = r[X] + v[X]
    r[Y] = r[Y] + v[Y]
    return r
  },

  sub(r, v) {
    r[X] = r[X] - v[X]
    r[Y] = r[Y] - v[Y]
    return r
  },

  scl(r, c) {
    r[X] *= c
    r[Y] *= c
    return r
  },

  dot(r, v) {
    return r[X] * v[X] + r[Y] * v[Y]
  },

  len2(r) {
    return r[X] ** 2 + r[Y] ** 2
  },

  len(r) {
    return Math.sqrt(r[X] ** 2 + r[Y] ** 2)
  },

  norml(r) {
    return this.scl(r, this.len(r))
  },
}

export default vec2

export const X = 0
export const Y = 1

const vec2 = {
  x(v) {
    return v[X]
  },
  y(v) {
    return v[Y]
  },
  create(x, y) {
    return [x, y]
  },
  set(v, r) {
    v[X] = r[X]
    v[Y] = r[Y]
    return v
  },
  clone(v) {
    return [v[X], v[Y]]
  },
  scale(v, c) {
    v[X] *= c
    v[Y] *= c
    return v
  },
  add(v, r) {
    v[X] = v[X] + r[X]
    v[Y] = v[Y] + r[Y]
    return v
  },
  scew(v, x, y) {
    v[X] *= x
    v[Y] *= y
    return v
  },
  sub(v, r) {
    v[X] = v[X] - r[X]
    v[Y] = v[Y] - r[Y]
    return v
  },
  len2(v) {
    return v[X] ** 2 + v[Y] ** 2
  },
  len(v) {
    return Math.sqrt(v[X] ** 2 + v[Y] ** 2)
  },
  floor(v) {
    v[X] = Math.floor(v[X])
    v[Y] = Math.floor(v[Y])
    return v
  },
  abs(v) {
    v[X] = Math.abs(v[X])
    v[Y] = Math.abs(v[Y])
    return v
  },
  round(v) {
    v[X] = Math.round(v[X])
    v[Y] = Math.round(v[Y])
    return v
  },
  equal(v, r) {
    return v[X] === r[X] && v[Y] === r[Y]
  },
}

export default vec2

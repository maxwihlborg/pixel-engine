/**
 * Modified version of
 *
 * https://github.com/hughsk/flood-fill
 */

const floodFill = (buffer, layer, [x, y]) => {
  const { cols, rows, data } = layer

  const get = (x, y) => {
    return data[x + y * cols]
  }
  const bget = (x, y) => {
    return buffer[x + y * cols]
  }
  const set = (x, y, v) => {
    buffer[x + y * cols] = v
  }

  const empty = get(x, y)

  const queuex = [x]
  const queuey = [y]

  let curry
  let currx
  let north
  let south
  let n

  let area = 0
  // arbirtary failsafe
  const maxArea = 200 * 200

  while (queuey.length) {
    currx = queuex.pop()
    curry = queuey.pop()

    if (get(currx, curry) === empty) {
      north = south = curry

      do {
        north -= 1
      } while (get(currx, north) === empty && north >= 0)

      do {
        south += 1
      } while (get(currx, south) === empty && south < rows)

      for (n = north + 1; n < south; n += 1) {
        set(currx, n, true)
        area += 1
        if (area > maxArea) {
          return
        }
        if (
          currx - 1 >= 0 &&
          !bget(currx - 1, n) &&
          get(currx - 1, n) === empty
        ) {
          queuex.push(currx - 1)
          queuey.push(n)
        }
        if (
          currx + 1 < cols &&
          !bget(currx + 1, n) &&
          get(currx + 1, n) === empty
        ) {
          queuex.push(currx + 1)
          queuey.push(n)
        }
      }
    }
  }
}

export default floodFill

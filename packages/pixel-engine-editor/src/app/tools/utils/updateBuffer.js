const startTile = (buffer, { cols }) => {
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== false) {
      return [i % cols, Math.floor(i / cols)]
    }
  }
  return [0, 0]
}

export default function updateBuffer(buffer, layer, pos, selection) {
  const { cols, rows } = layer

  let minx = selection.length
  let maxx = 0
  let miny = selection.length
  let maxy = 0

  let x, y, t
  for (let i = 0; i < selection.length; i++) {
    ;[x, y, t] = selection[i]
    minx = Math.min(x, minx)
    maxx = Math.max(x, maxx)
    miny = Math.min(y, miny)
    maxy = Math.max(y, maxy)
  }

  const sw = 1 + maxx - minx
  const sh = 1 + maxy - miny

  const tiles = new Array(selection.length)
  for (let i = 0; i < selection.length; i++) {
    ;[x, y, t] = selection[i]
    tiles[(x - minx) % sw + (y - miny) * sw] = t
  }

  const [sx, sy] = startTile(buffer, layer)

  const get = (x, y) => {
    const tx = x % sw
    const ty = (y % sh) * sw
    return tiles[tx + ty]
  }

  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== false) {
      const t = get(i % cols, Math.floor(i / cols))
      buffer[i] = t
    }
  }
}

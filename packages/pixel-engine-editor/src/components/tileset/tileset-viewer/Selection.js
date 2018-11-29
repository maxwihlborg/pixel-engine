export default class Selection {
  constructor(channel) {
    this.selection = []
    this.tileset = null
    this._start = null
    this._end = null
  }

  setTileset(tileset) {
    this.tileset = tileset
  }

  get() {
    if (!this.selection.length) {
      return []
    }
    let minx = this.tileset.cols
    let miny = this.tileset.rows
    let maxx = 0
    let maxy = 0

    let x, y, t
    for (let i = 0; i < this.selection.length; i++) {
      ;[x, y, t] = this.selection[i]
      minx = Math.min(minx, x)
      maxx = Math.max(maxx, x)
      miny = Math.min(miny, y)
      maxy = Math.max(maxy, y)
    }

    const width = maxx - minx
    const height = maxy - miny
    const sx = Math.floor(width / 2)
    const sy = Math.floor(height / 2)

    const out = new Array(this.selection.length)
    for (let j = 0; j < this.selection.length; j++) {
      ;[x, y, t] = this.selection[j]
      out[j] = [x - minx - sx, y - miny - sy, t]
    }

    return out
  }

  clear() {
    this.selection = []
  }

  start(tile) {
    this._start = tile
    this.selection = []
    return this.update(this._start)
  }

  update(end) {
    this._end = end
    if (!(this._start && this._end)) {
      return false
    }
    const [sx, sy] = this._start
    const [ex, ey] = this._end
    const dx = sx - ex
    const dy = sy - ey

    const tx = dx > 0 ? ex : sx
    const ty = dy > 0 ? ey : sy

    const mi = tx + Math.abs(dx) + 1
    const mj = ty + Math.abs(dy) + 1
    const nextSelection = new Array(Math.abs(dx) * Math.abs(dy))

    let o = 0
    for (let i = tx; i < mi; i++) {
      for (let j = ty; j < mj; j++) {
        nextSelection[o] = [i, j, i + j * this.tileset.cols]
        o += 1
      }
    }

    const changes =
      nextSelection.length !== this.selection.length ||
      !nextSelection.every((t, i) => {
        return !!this.selection[i] && this.selection[i][2] === t[2]
      })

    if (changes) {
      this.selection = nextSelection
    }

    return changes
  }

  draw(ctx, zoom) {
    if (!(this.tileset && this.tileset.tileWidth && this.tileset.tileHeight)) {
      return
    }
    const { tileWidth, tileHeight } = this.tileset
    ctx.save()
    ctx.fillStyle = '#0374D9'
    ctx.globalAlpha = 0.5
    let x, y
    for (let i = 0; i < this.selection.length; i++) {
      ;[x, y] = this.selection[i]
      ctx.fillRect(
        x * tileWidth * zoom,
        y * tileHeight * zoom,
        tileWidth * zoom,
        tileHeight * zoom
      )
    }
    ctx.restore()
  }
}

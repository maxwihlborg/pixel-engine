import Layer from './Layer'
import vec2 from '../math/vec2'
import bbox from '../math/bbox'

const tileData = (data, { cols, rows }) => {
  if (Array.isArray(data)) {
    return data
  }
  let out = new Array(cols * rows)
  for (let i = 0; i < out.length; i++) {
    out[i] = -1
  }
  return out
}

export default class TileLayer extends Layer {
  constructor(name, data, tileset, options) {
    super(name, tileData(data, options), options)
    this.tileset = tileset
  }

  get(x, y) {
    return this.data[x + y * this.cols]
  }

  getTile([x, y]) {
    return this.get(x, y)
  }

  setTile([x, y], tile) {
    const valid = x >= 0 && x < this.cols && y >= 0 && y < this.rows
    if (valid) {
      this.data[x + y * this.cols] = tile
    }
    return valid
  }

  draw(ctx, camera) {
    const { tileWidth: tw, tileHeight: th, rows, cols } = this
    const { offset, area, zoom } = camera.getBounds(ctx, tw, th, cols, rows)

    const sx = bbox.x(area)
    const sy = bbox.y(area)
    const maxx = bbox.width(area)
    const maxy = bbox.height(area)

    const mx = tw * zoom
    const my = th * zoom

    const ox = vec2.x(offset)
    const oy = vec2.y(offset)

    ctx.save()
    if (this.alpha < 1) {
      ctx.globalAlpha = this.alpha
    }
    for (let x = sx; x < maxx; x++) {
      for (let y = sy; y < maxy; y++) {
        this.tileset.draw(
          ctx,
          this.data[x + y * cols],
          ox + (x - sx) * mx,
          oy + (y - sy) * my,
          zoom
        )
      }
    }
    ctx.restore()
  }
}

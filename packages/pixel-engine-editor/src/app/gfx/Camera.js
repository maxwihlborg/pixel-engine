import vec2 from '../math/vec2'
import bbox from '../math/bbox'
import bresenham from 'bresenham'

export default class Camera {
  constructor() {
    this.offset = [100, 10]
    this.floatOffset = [100, 100]
    this.zoom = 2
  }

  setupChannel(channel) {
    channel.on('@app:zoom:set', zoom => {
      this.zoom = zoom
    })
  }

  translate(delta) {
    vec2.add(this.floatOffset, delta)
    vec2.set(this.offset, vec2.round(vec2.clone(this.floatOffset)))
  }

  bresenham(layer, end, delta, cb) {
    const { tileWidth: tw, tileHeight: th, cols, rows } = layer
    const start = vec2.sub(vec2.clone(end), delta)

    const [sx, sy] = this.getPoint(layer, start)
    const [ex, ey] = this.getPoint(layer, end)
    return bresenham(sx, sy, ex, ey, (x, y) => cb(vec2.floor([x, y])))
  }

  getPoint({ tileWidth: tw, tileHeight: th, cols, rows }, [px, py]) {
    const [cx, cy] = this.offset
    const zoom = this.zoom

    const maxw = tw * cols * zoom
    const maxh = th * rows * zoom
    const mx = tw * zoom
    const my = th * zoom

    const tx = (px - cx) / mx
    const ty = (py - cy) / my
    return [tx, ty]
  }

  getTile(layer, pos, out = false) {
    const tile = vec2.floor(this.getPoint(layer, pos))

    const bounds = bbox.create(0, 0, layer.cols, layer.rows)
    const valid = bbox.has(bounds, tile)
    if (out) {
      return {
        valid: valid,
        tile: tile,
      }
    }

    return valid && tile
  }

  getBounds(ctx, tw, th, cols, rows) {
    const { width, height } = ctx.canvas
    const [cx, cy] = this.offset
    const zoom = this.zoom

    const maxw = tw * cols * zoom
    const maxh = th * rows * zoom

    const sx = cx >= 0 ? 0 : Math.min(cols, Math.floor(-cx / (tw * zoom)))
    const sy = cy >= 0 ? 0 : Math.min(rows, Math.floor(-cy / (th * zoom)))

    const ox = cx + sx * tw * zoom
    const oy = cy + sy * th * zoom

    const mx = Math.ceil(Math.min(cols - sx, (width - ox) / (tw * zoom)))
    const my = Math.ceil(Math.min(rows - sy, (height - oy) / (th * zoom)))

    const ex = Math.min(cols, sx + mx)
    const ey = Math.min(cols, sy + my)

    return {
      offset: vec2.create(ox, oy),
      area: bbox.create(sx, sy, ex, ey),
      zoom: this.zoom,
    }
  }
}

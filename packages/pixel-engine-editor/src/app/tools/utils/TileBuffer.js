import vec2 from '../../math/vec2'
import bbox from '../../math/bbox'
import floodFill from './floodFill'
import updateBuffer from './updateBuffer'

export default class TileBuffer {
  constructor() {
    this.data = []
    this.hasData = false
  }

  clear() {
    if (this.hasData) {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] = false
      }
      this.hasData = false
    }
  }

  get(pos, layer) {
    return this.data[vec2.x(pos) + vec2.y(pos) * layer.cols]
  }

  update(camera, input, layer, cb) {
    if (layer && layer.visible) {
      if (this.data.length !== layer.data.length) {
        this.data = new Array(layer.cols * layer.rows)
        this.hasData = true
        this.clear()
      }
      const { valid, tile } = camera.getTile(layer, input.mouse.position, true)
      cb(valid, tile)
    }
  }

  put(layer) {
    if (this.hasData) {
      const pos = vec2.create()

      for (let i = 0; i < this.data.length; i++) {
        const tile = this.data[i]

        if (tile !== false) {
          pos[0] = i % layer.cols
          pos[1] = Math.floor(i / layer.cols)

          layer.setTile(pos, tile)
        }
      }
    }
  }

  fill(layer, pos, selection) {
    floodFill(this.data, layer, pos)
    updateBuffer(this.data, layer, pos, selection)
    this.hasData = true
  }

  draw(ctx, camera, layer, tileset) {
    if (!(this.hasData && layer && layer.visible && tileset !== null)) {
      return
    }

    const { tileWidth: tw, tileHeight: th, rows, cols } = layer
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
    ctx.fillStyle = '#0374D9'

    for (let x = sx; x < maxx; x++) {
      for (let y = sy; y < maxy; y++) {
        const px = ox + (x - sx) * mx
        const py = oy + (y - sy) * my

        const tile = this.data[x + y * cols]

        if (tile !== false) {
          ctx.globalAlpha = 0.8
          tileset.draw(ctx, tile, px, py, zoom)
          ctx.globalAlpha = 0.5
          ctx.fillRect(px, py, mx, my)
        }
      }
    }

    ctx.restore()
  }
}

import vec2 from '../../math/vec2'
import bbox from '../../math/bbox'

export default class Area {
  constructor() {
    this._active = false
    this.start = false
    this.end = false
  }

  active() {
    return !!(this.start && this.end)
  }

  update(pos, camera, input, layer) {
    const bounds = bbox.create(0, 0, layer.cols, layer.rows)
    if (!this._active) {
      if (bbox.has(bounds, pos)) {
        this._active = true
        this.start = vec2.clone(pos)
      } else {
        this.start = false
        this.end = false
      }
    }
    if (this._active) {
      camera.bresenham(layer, input.mouse.position, input.mouse.delta, pos => {
        if (bbox.has(bounds, pos)) {
          this.end = pos
        }
      })
    }
  }

  released() {
    this._active = false
  }

  selection(cb) {
    if (!this.active()) {
      return []
    }

    const sx = Math.min(vec2.x(this.start), vec2.x(this.end))
    const sy = Math.min(vec2.y(this.start), vec2.y(this.end))

    const [w, h] = vec2.add(
      vec2.abs(vec2.sub(vec2.clone(this.start), this.end)),
      [1, 1]
    )

    const hw = Math.floor(w / 2)
    const hh = Math.floor(h / 2)

    const ex = sx + w
    const ey = sy + h

    const pos = vec2.create()
    const area = { sx, sy, w, h, hw, hh, ex, ey }
    for (let x = sx; x < ex; x++) {
      for (let y = sy; y < ey; y++) {
        pos[0] = x
        pos[1] = y

        cb(pos, area)
      }
    }
  }

  get(layer) {
    const selection = []
    this.selection((pos, { sx, sy, hw, hh }) => {
      const tile = layer.getTile(pos)
      if (tile !== -1) {
        selection.push([vec2.x(pos) - sx - hw, vec2.y(pos) - sy - hh, tile])
      }
    })
    return selection
  }

  reset() {
    this._active = false
    this.start = false
    this.end = false
  }

  draw(ctx, camera, layer) {
    if (!(layer && layer.visible && this.active())) {
      return
    }

    const mx = camera.zoom * layer.tileWidth
    const my = camera.zoom * layer.tileHeight

    const pos = vec2.add(
      vec2.scew(
        vec2.create(
          Math.min(vec2.x(this.start), vec2.x(this.end)),
          Math.min(vec2.y(this.start), vec2.y(this.end))
        ),
        mx,
        my
      ),
      camera.offset
    )

    const size = vec2.scew(
      vec2.add(vec2.abs(vec2.sub(vec2.clone(this.start), this.end)), [1, 1]),
      mx,
      my
    )

    ctx.save()
    ctx.fillStyle = '#0374D9'
    ctx.globalAlpha = 0.5

    ctx.fillRect(vec2.x(pos), vec2.y(pos), vec2.x(size), vec2.y(size))

    ctx.restore()
  }
}

import vec2 from '../math/vec2'
import bbox from '../math/bbox'

export default class Grid {
  constructor(options) {
    this.visible = true
  }

  setupChannel(channel) {
    channel.on('@app:grid:set', visible => {
      this.visible = visible
    })
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  draw(ctx, camera, layer) {
    if (!(this.visible && layer)) {
      return
    }
    const { tileWidth: tw, tileHeight: th, rows, cols } = layer
    const { offset, area, zoom } = camera.getBounds(ctx, tw, th, cols, rows)

    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.setLineDash([2, 2])

    const g = 0.5
    const mx = tw * zoom
    const my = th * zoom

    const mc = bbox.width(area) - bbox.x(area)
    const mr = bbox.height(area) - bbox.y(area)

    const ox = vec2.x(offset) + g
    const ex = mc * tw * zoom + g

    const oy = vec2.y(offset) + g
    const ey = mr * th * zoom + g

    for (let c = 0; c <= mc; c++) {
      ctx.beginPath()
      ctx.moveTo(c * mx + ox, oy)
      ctx.lineTo(c * mx + ox, oy + ey)
      ctx.stroke()
    }
    for (let r = 0; r <= mr; r++) {
      ctx.beginPath()
      ctx.moveTo(ox, r * my + oy)
      ctx.lineTo(ox + ex, r * my + oy)
      ctx.stroke()
    }

    ctx.restore()
  }
}

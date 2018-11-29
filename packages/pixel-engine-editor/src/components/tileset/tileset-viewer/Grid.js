export default class Grid {
  constructor() {
    this.visible = true
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  draw(ctx, tileset, zoom = 1) {
    if (!(tileset && tileset.tileWidth && tileset.tileHeight)) {
      return
    }
    const { width: cw, height: ch } = ctx.canvas
    const { tileWidth: tw, tileHeight: th } = tileset
    if (!this.visible && tw && th) {
      return
    }
    const mw = tw * zoom
    const mh = th * zoom

    const mc = cw / mw
    const mr = ch / mh

    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.setLineDash([2, 2])

    for (let c = 0; c <= mc; c++) {
      ctx.beginPath()
      ctx.moveTo(c * mw + 0.5, 0)
      ctx.lineTo(c * mw + 0.5, ch)
      ctx.stroke()
    }

    for (let r = 0; r <= mr; r++) {
      ctx.beginPath()
      ctx.moveTo(0, r * mh + 0.5)
      ctx.lineTo(cw, r * mh + 0.5)
      ctx.stroke()
    }

    ctx.restore()
  }
}

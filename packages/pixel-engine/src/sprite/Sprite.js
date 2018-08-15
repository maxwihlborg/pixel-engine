import { vec2, aabb } from '../math'

export default class Sprite {
  constructor(img, bounds, anchor = vec2.create()) {
    this.img = img
    this.setBounds(bounds)
    this.setAnchor(anchor)
  }

  setBounds(bounds) {
    this.ox = aabb.x(bounds)
    this.oy = aabb.y(bounds)
    this.width = aabb.width(bounds)
    this.height = aabb.height(bounds)
  }

  setAnchor(anchor) {
    this.ax = vec2.x(anchor) * this.width
    this.ay = vec2.y(anchor) * this.height
  }

  getBBox(pos) {
    return aabb.create(
      vec2.x(pos) - this.ax,
      vec2.y(pos) - this.ay,
      this.width,
      this.height
    )
  }

  draw(ctx, pos) {
    ctx.drawImage(
      this.img,
      this.ox,
      this.oy,
      this.width,
      this.height,
      vec2.x(pos) + this.ax,
      vec2.y(pos) + this.ay,
      this.width,
      this.height
    )
  }
}

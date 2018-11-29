export default class Tileset {
  constructor(img, { src, shape: [width, height] }, startTile = 0) {
    this.img = img
    this.src = src

    this.cols = Math.floor(img.width / width)
    this.rows = Math.floor(img.height / height)

    this.tileWidth = width
    this.tileHeight = height
    this.width = this.cols * width
    this.height = this.rows * height

    this.size = this.cols * this.rows
    this.startTile = startTile
    this.endTile = startTile + this.size
  }

  get(idx) {
    if (this.startTile <= idx && idx < this.endTile) {
      return false
    }
    const i = idx - this.startTile
    return [i % this.cols, Math.floor(i / this.cols)]
  }

  draw(ctx, idx, x, y, zoom = 1) {
    if (!(this.startTile <= idx && idx < this.endTile)) {
      return false
    }

    const i = idx - this.startTile
    const tx = i % this.cols
    const ty = Math.floor(i / this.cols)

    ctx.drawImage(
      this.img,
      tx * this.tileWidth,
      ty * this.tileHeight,
      this.tileWidth,
      this.tileHeight,
      x,
      y,
      this.tileWidth * zoom,
      this.tileHeight * zoom
    )
  }
}

import Selection from './Selection'
import Grid from './Grid'

export default class TilesetViewer {
  constructor(node, channel) {
    this.node = node
    this.canvas = this.node.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.selection = new Selection(channel)
    this.channel = channel
    this.grid = new Grid()

    this.paint(this.ctx)
    this.setZoom(1)

    this.setupChannel()
    this.setupListeners()
  }

  setupChannel() {
    this.channel.on('@tileset:change', tileset => {
      this.tileset = tileset
      this.selection.setTileset(tileset)
      this.setZoom(this.zoom)
    })
  }

  getTile = e => {
    e.preventDefault()
    const bounds = this.canvas.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top

    const px = x / this.zoom
    const py = y / this.zoom

    if (
      !(
        this.tileset &&
        px < this.tileset.width &&
        py < this.tileset.height
      )
    ) {
      return -1
    }

    return [
      Math.floor(px / this.tileset.tileWidth),
      Math.floor(py / this.tileset.tileHeight),
    ]
  }

  onMouseDown = e => {
    const tile = this.getTile(e)
    if (tile === -1) {
      this.selection.clear()
      this.paint(this.ctx)
    } else if (this.selection.start(tile)) {
      this.mouseDown = true
      this.paint(this.ctx)
    }
  }

  onMouseUp = () => {
    this.channel.dispatch('@tools:selection:set', this.selection.get())
  }

  onMouseMove = e => {
    const tile = this.getTile(e)
    if (tile !== -1 && this.mouseDown && this.selection.update(tile)) {
      this.paint(this.ctx)
    }
  }

  onKeyDown = e => {
    if (e.keyCode === 32) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  setupListeners() {
    this.mouseDown = false

    this.node.addEventListener('mousedown', this.onMouseDown, false)
    this.node.addEventListener('contextmenu', this.onMouseDown, false)
    this.node.addEventListener('mouseup', this.onMouseUp, false)
    this.node.addEventListener('mousemove', this.onMouseMove, false)
    this.node.addEventListener('keydown', this.onKeyDown, false)

    document.addEventListener(
      'mouseup',
      () => {
        this.mouseDown = false
      },
      false
    )
  }

  setZoom(zoom) {
    this.zoom = zoom
    if (this.tileset && this.tileset.width && this.tileset.height) {
      this.canvas.width = this.tileset.width * zoom + 1
      this.canvas.height = this.tileset.height * zoom + 1
      this.ctx.imageSmoothingEnabled = false
      this.paint(this.ctx)
    }
  }

  clear() {
    this.canvas.width = 0
    this.canvas.height = 0
  }

  paint(ctx) {
    const { width, height } = this.canvas
    ctx.clearRect(0, 0, width, height)
    if (this.tileset && this.tileset.img) {
      ctx.drawImage(this.tileset.img, 0, 0, width, height)
    }
    this.selection.draw(ctx, this.zoom)
    this.grid.draw(ctx, this.tileset, this.zoom)
  }
}

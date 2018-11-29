import Tool from './Tool'
import vec2 from '../math/vec2'
import bbox from '../math/bbox'
import Area from './utils/Area'

export default class PencilTool extends Tool {
  constructor(name, hotkey) {
    super(name, {
      hotkey: hotkey,
      mask: Tool.TOOL_TILE_LAYER,
      icon: 'paint-brush',
    })

    this.mode = 'draw'

    this.position = false
    this.area = new Area()

    this.selection = []
    this.tileset = null
    this.hasPut = false

    this.onPositionChange = () => {}
  }

  setTileset = tileset => {
    this.tileset = tileset
  }

  setSelection = selection => {
    this.selection = selection
  }

  setupChannel(channel) {
    channel.on('@tileset:change', this.setTileset)
    channel.on('@tools:selection:set', this.setSelection)

    this.onPositionChange = pos => {
      channel.dispatch('@tools:position:set', pos)
    }
  }

  put(camera, input, layer) {
    camera.bresenham(layer, input.mouse.position, input.mouse.delta, pos => {
      for (let i = 0; i < this.selection.length; i++) {
        const tile = this.selection[i]
        if (layer.setTile(vec2.add(vec2.clone(pos), tile), tile[2])) {
          this.hasPut = true
        }
      }
    })
  }

  update(camera, input, layer) {
    this.shouldDraw = !!(layer && layer.visible)

    if (this.shouldDraw) {
      this.mode = 'draw'
      const prevPosition = this.position && vec2.clone(this.position)
      this.position = camera
        .getTile(layer, input.mouse.position, true)
        .tile.slice(0, 2)

      if (!prevPosition || !vec2.equal(prevPosition, this.position)) {
        this.onPositionChange(
          bbox.has([0, 0, layer.rows, layer.cols], this.position) &&
            this.position
        )
      }

      if (input.down('rightmouse')) {
        this.mode = 'select'
        this.area.update(this.position, camera, input, layer)
      } else if (input.released('rightmouse')) {
        this.setSelection(this.area.get(layer))
        this.area.reset()
      } else if (input.down('leftmouse')) {
        this.put(camera, input, layer)
      } else if (input.released('leftmouse')) {
        if (this.hasPut) {
          layer.snapshot()
          this.hasPut = false
        }
      }
    }
  }

  drawOverlay(ctx, camera, layer) {
    ctx.save()

    const mx = camera.zoom * layer.tileWidth
    const my = camera.zoom * layer.tileHeight
    const bounds = bbox.create(0, 0, layer.cols, layer.rows)

    for (let i = 0; i < this.selection.length; i++) {
      const tile = this.selection[i]
      const pos = vec2.add(vec2.clone(tile), this.position)
      const valid = bbox.has(bounds, pos)
      vec2.add(vec2.scew(pos, mx, my), camera.offset)

      ctx.fillStyle = valid ? '#0374D9' : '#FF4137'
      ctx.globalAlpha = 0.8
      this.tileset.draw(ctx, tile[2], vec2.x(pos), vec2.y(pos), camera.zoom)
      ctx.globalAlpha = 0.5
      ctx.fillRect(vec2.x(pos), vec2.y(pos), mx, my)
    }
    ctx.restore()
  }

  draw(ctx, camera, layer) {
    if (!(this.shouldDraw && this.tileset !== null && this.position)) {
      return
    }

    switch (this.mode) {
      case 'select':
        this.area.draw(ctx, camera, layer)
        break
      case 'draw':
        this.drawOverlay(ctx, camera, layer)
        break
    }
  }
}

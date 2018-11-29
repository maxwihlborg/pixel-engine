import Tool from './Tool'
import Area from './utils/Area'
import TileBuffer from './utils/TileBuffer'
import vec2 from '../math/vec2'
import bbox from '../math/bbox'

export default class FillTool extends Tool {
  constructor(name, hotkey) {
    super(name, {
      hotkey: hotkey,
      mask: Tool.TOOL_TILE_LAYER,
      icon: 'fill-drip',
    })

    this.mode = 'fill'

    this.buffer = new TileBuffer()
    this.area = new Area()

    this.selection = []
    this.tileset = null
    this.tile = null
  }

  setTileset = tileset => {
    this.tileset = tileset
  }

  setSelection = selection => {
    this.selection = selection
    if (selection.length) {
      const middle = selection.find(t => t[0] === 0 && t[1] === 0)
      this.tile = middle ? middle[2] : selection[0][2]
    } else {
      this.tile = null
    }
  }

  setupChannel(channel) {
    channel.on('@tileset:change', this.setTileset)
    channel.on('@tools:selection:set', this.setSelection)
  }

  update(camera, input, layer) {
    this.shouldDraw = !!(layer && layer.visible)

    if (this.shouldDraw) {
      this.mode = 'fill'
      if (input.down('rightmouse')) {
        this.mode = 'select'
        this.area.update(
          camera.getTile(layer, input.mouse.position, true).tile.slice(0, 2),
          camera,
          input,
          layer
        )
      } else if (input.released('rightmouse')) {
        this.setSelection(this.area.get(layer))
        this.area.reset()
      } else {
        if (this.selection.length) {
          this.buffer.update(camera, input, layer, (valid, pos) => {
            if (valid && layer.getTile(pos) !== this.tile) {
              if (this.buffer.get(pos, layer) === false) {
                this.buffer.clear()
                this.buffer.fill(layer, pos, this.selection)
              }
            } else {
              this.buffer.clear()
            }
          })
        } else {
          this.buffer.clear()
        }
        if (input.pressed('leftmouse')) {
          this.buffer.put(layer)
          if (this.buffer.hasData) {
            layer.snapshot()
          }
          this.buffer.clear()
        }
      }
    }
  }

  draw(ctx, camera, layer) {
    if (!(this.shouldDraw && this.tileset !== null && layer)) {
      return
    }
    switch (this.mode) {
      case 'select':
        this.area.draw(ctx, camera, layer)
        break
      case 'fill':
        this.buffer.draw(ctx, camera, layer, this.tileset)
        break
    }
  }
}

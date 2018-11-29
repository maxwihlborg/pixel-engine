import Tool from './Tool'
import vec2 from '../math/vec2'
import bbox from '../math/bbox'
import Area from './utils/Area'

export default class AreaTool extends Tool {
  constructor(name, hotkey) {
    super(name, {
      hotkey: hotkey,
      mask: Tool.TOOL_TILE_LAYER,
      icon: 'vector-square',
    })

    this.tileset = null
    this.area = new Area()
  }

  onSelect() {
    this.channel.dispatch('@control:edit:selection:set', !!this.area.active())
  }

  setupChannel(channel) {
    this.channel = channel
    this.channel.on('@tileset:change', tileset => {
      this.tileset = tileset
    })
  }

  copy(layer) {
    if (this.area.active()) {
      this.channel.dispatch('@control:edit:clipboard:set', this.area.get(layer))
    }
  }

  clear(layer) {
    this.area.selection(pos => {
      layer.setTile(pos, -1)
    })
    this.channel.dispatch('@control:edit:selection:set', false)
  }

  update(camera, input, layer) {
    this.shouldDraw = !!(layer && layer.visible)

    if (this.shouldDraw) {
      if (input.pressed('cut')) {
        this.copy(layer)
        this.clear(layer)
        this.area.reset()
        layer.snapshot()
      } else if (input.pressed('copy')) {
        this.copy(layer)
        this.area.reset()
      } else if (input.pressed('remove')) {
        this.clear(layer)
        this.area.reset()
        layer.snapshot()
      }
      if (input.down('leftmouse')) {
        this.area.update(
          camera.getTile(layer, input.mouse.position, true).tile.slice(0, 2),
          camera,
          input,
          layer
        )
        if (input.pressed('leftmouse')) {
          this.channel.dispatch('@control:edit:selection:set', false)
        }
      }
    }
    if (input.released('leftmouse')) {
      if (this.area.active()) {
        this.channel.dispatch(
          '@control:edit:selection:set',
          !!this.area.get(layer).length
        )
      }
      this.area.released()
    }
  }

  draw(ctx, camera, layer) {
    if (this.shouldDraw) {
      this.area.draw(ctx, camera, layer)
    }
  }
}

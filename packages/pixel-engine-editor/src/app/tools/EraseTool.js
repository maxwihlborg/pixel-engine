import Tool from './Tool'
import bbox from '../math/bbox'
import vec2 from '../math/vec2'

export default class EraseTool extends Tool {
  constructor(name, hotkey) {
    super(name, { hotkey: hotkey, mask: Tool.TOOL_TILE_LAYER, icon: 'eraser' })

    this.position = false
    this.hasErased = false
    this.onPositionChange = () => {}
  }

  setupChannel(channel) {
    this.onPositionChange = pos => {
      channel.dispatch('@tools:position:set', pos)
    }
  }

  put(camera, input, layer) {
    camera.bresenham(layer, input.mouse.position, input.mouse.delta, pos => {
      if (layer.setTile(vec2.clone(pos), -1)) {
        this.hasErased = true
      }
    })
  }

  update(camera, input, layer) {
    this.shouldDraw = !!(layer && layer.visible)

    if (this.shouldDraw) {
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
      if (input.down('leftmouse')) {
        this.put(camera, input, layer)
      } else if (input.released('leftmouse')) {
        if (this.hasErased) {
          layer.snapshot()
          this.hasErased = false
        }
      }
    }
  }

  draw(ctx, camera, layer) {
    const mx = camera.zoom * layer.tileWidth
    const my = camera.zoom * layer.tileHeight
    const bounds = bbox.create(0, 0, layer.cols, layer.rows)

    if (bbox.has(bounds, this.position)) {
      const pos = vec2.add(
        vec2.scew(vec2.clone(this.position), mx, my),
        camera.offset
      )
      ctx.save()
      ctx.fillStyle = '#FF4137'
      ctx.globalAlpha = 0.5
      ctx.fillRect(vec2.x(pos), vec2.y(pos), mx, my)
      ctx.restore()
    }
  }
}

import Tileset from './gfx/Tileset'
import Camera from './gfx/Camera'
import Canvas from './gfx/Canvas'
import Grid from './gfx/Grid'

import InputListener from './io/InputListener'

import LayerStack from './layer/LayerStack'
import TileLayer from './layer/TileLayer'

import PencilTool from './tools/PencilTool'
import EraseTool from './tools/EraseTool'
import FillTool from './tools/FillTool'
import AreaTool from './tools/AreaTool'
import ToolSet from './tools/ToolSet'
import Tool from './tools/Tool'

import Timer from './utils/Timer'

import { loadTileset } from './loaders'

export default class Editor {
  constructor(node, channel) {
    this.properties = {
      tileWidth: 16,
      tileHeight: 16,
      cols: 20,
      rows: 20,
    }
    this.node = node
    this.canvas = new Canvas(node)
    this.inputListener = this.canvas.addInputListener(
      new InputListener({
        leftmouse: [InputListener.Buttons.LEFT],
        rightmouse: [InputListener.Buttons.RIGHT],
        space: [InputListener.Keys.KEY_SPACE],
        cut: ['@control:edit:cut', InputListener.Keys.KEY_X],
        copy: ['@control:edit:copy', InputListener.Keys.KEY_C],
        undo: ['@control:history:undo', InputListener.Keys.KEY_U],
        redo: ['@control:history:redo', InputListener.Keys.KEY_R],
        remove: [
          InputListener.Keys.KEY_DELETE,
          InputListener.Keys.KEY_BACKSPACE,
        ],
      })
    )
    this.grid = new Grid()
    this.layers = new LayerStack()
    this.tools = new ToolSet([
      new AreaTool('area', 'v'),
      new PencilTool('pencil', ['p', 'b']),
      new EraseTool('erase', 'e'),
      new FillTool('fill', 'f'),
    ])
    this.tools.set('pencil')
    this.camera = new Camera()
    this.timer = new Timer()

    this.setupListeners()
    this.setupChannel(channel)

    loadTileset('/res/tilesets/dungeon.json').then(tileset => {
      channel.dispatch('@tileset:change', tileset)
      this.layers.add(
        new TileLayer('Test Layer', null, tileset, this.properties)
      )
      this.layers.set(0)
    })
  }

  setupChannel(channel) {
    this.layers.setupChannel(channel)
    this.tools.setupChannel(channel)
    this.inputListener.setupChannel(channel)
    this.camera.setupChannel(channel)
    this.grid.setupChannel(channel)
  }

  onMouseEnter = () => {
    this.inputListener.listen(true)
  }

  onMouseLeave = () => {
    this.inputListener.listen(false)
  }

  setupListeners() {
    this.node.addEventListener('mouseenter', this.onMouseEnter, false)
    this.node.addEventListener('mouseleave', this.onMouseLeave, false)

    this.canvas.onResize = dimension => {
      this.layers.resizeBuffer(dimension)
      this.paint(this.canvas.ctx, this.tools.current(), this.layers.active())
    }
  }

  apply(layer) {}

  paint(ctx, tool, layer) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    this.layers.draw(ctx, this.camera)
    if (tool) {
      tool.draw(ctx, this.camera, layer)
    }
    this.grid.draw(ctx, this.camera, layer)
  }

  set cursor(next) {
    if (next !== this._cursor) {
      this._cursor = next
      this.node.style.cursor = next
    }
  }

  get cursor() {
    return this._cursor
  }

  start() {
    this.timer.start(() => {
      const input = this.inputListener.getState()

      const tool = this.tools.current()
      const layer = this.layers.active()

      let drawTool = false
      if (input.down('space') && input.down('leftmouse')) {
        this.cursor = 'grabbing'
        this.camera.translate(input.mouse.delta)
      } else if (input.down('space')) {
        this.cursor = 'grab'
      } else {
        this.cursor = 'default'
        if (input.pressed('undo')) {
          layer.back()
          drawTool = true
        } else if (input.pressed('redo')) {
          layer.forward()
          drawTool = true
        } else if (tool) {
          tool.update(this.camera, input, layer)
          drawTool = true
        }
      }

      this.paint(this.canvas.ctx, drawTool && tool, layer)
    })
  }

  stop() {
    this.timer.stop()
  }
}

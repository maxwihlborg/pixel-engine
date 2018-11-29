import Grid from '../gfx/Grid'

let uuid = 0

export default class LayerStack {
  constructor() {
    this.layers = []
  }

  onChange = layer => {}

  setupChannel(channel) {
    this.onChange = layer => {
      channel.dispatch('@control:history:change', {
        undo: layer.hasPrev(),
        redo: layer.hasNext(),
      })
      channel.dispatch('@history:push', {
        content: `${uuid++}: Entry`,
      })
    }
  }

  add(layer) {
    if (Array.isArray(layer)) {
      layer.forEach(layer => this.add(layer))
      return
    }
    layer.onChange = this.onChange
    this.layers.unshift(layer)
  }

  set(idx) {
    const valid = idx >= 0 && idx < this.layers.length
    this._active = valid && idx
  }

  delete(layer) {
    const idx = this.layers.indexOf(layer)
    if (idx !== -1) {
      this.layers[idx].onChange = undefined
      this.layers.splice(idx, 1)
    }
  }

  resizeBuffer(dimension) {
    this.layers.forEach(layer => layer.resizeBuffer(dimension))
  }

  draw(ctx, camera) {
    this.layers.forEach(layer => layer.draw(ctx, camera))
  }

  active() {
    if (this._active !== false) {
      return this.layers[this._active]
    }
    return null
  }
}

import diff from 'fast-array-diff'

const __types = ['add', 'remove', 'same']
const __index = __types.reduce((acc, type, i) => {
  acc[type] = i
  return acc
}, {})

const patch = {
  serialize(patch) {
    return patch.map(({ type, oldPos, newPos, items }) => [
      __index[type],
      oldPos,
      newPos,
      items,
    ])
  },
  deserialize(patch) {
    return patch.map(([type, oldPos, newPos, items]) => ({
      type: __types[type],
      oldPos: oldPos,
      newPos: newPos,
      items: items,
    }))
  },
}

export default class Layer {
  constructor(name, data = [], { tileWidth, tileHeight, cols, rows }) {
    this.name = name
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.cols = cols
    this.rows = rows
    this.data = data
    this._startData = data.slice(0)
    this._prevData = new Array(data.length)
    this._patches = []
    this._patchIndex = 0
    this._setPrevData()

    this.alpha = 1
    this.visible = true
  }

  _setPrevData() {
    for (let i = 0; i < this.data.length; i++) {
      this._prevData[i] = this.data[i]
    }
    this.onChange(this)
  }

  _resetData() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = this._startData[i]
    }
  }

  onChange = () => {}

  hasNext() {
    return this._patchIndex < this._patches.length
  }

  hasPrev() {
    return this._patchIndex > 0
  }

  snapshot() {
    const offset = this._patches.length - this._patchIndex
    if (offset > 0) {
      this._patches.splice(this._patchIndex, offset)
    }
    const nextPatch = patch.serialize(diff.getPatch(this._prevData, this.data))
    if (!!nextPatch.length) {
      this._patches.push(nextPatch)
      this._patchIndex += 1
      this._setPrevData()
    }
  }

  back() {
    if (this.hasPrev()) {
      this._patchIndex = Math.max(0, this._patchIndex - 1)
      if (this._patchIndex >= 0) {
        this._resetData()
        for (let i = 0; i < this._patchIndex; i++) {
          this.data = diff.applyPatch(
            this.data,
            patch.deserialize(this._patches[i])
          )
        }
        this._setPrevData()
      }
    }
  }

  forward() {
    if (this.hasNext()) {
      this._patchIndex = Math.min(this._patches.length, this._patchIndex + 1)
      if (this._patchIndex <= this._patches.length) {
        this._resetData()
        for (let i = 0; i < this._patchIndex; i++) {
          this.data = diff.applyPatch(
            this.data,
            patch.deserialize(this._patches[i])
          )
        }
        this._setPrevData()
      }
    }
  }

  setVisible(visible = true) {
    this.visible = visible
  }

  resizeBuffer() {}

  draw(ctx, camera) {}
}

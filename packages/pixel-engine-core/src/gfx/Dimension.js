import EventEmitter from '../utils/EventEmitter'

export const DIMENSION_AUTO = 1 << 0

export default class Dimension extends EventEmitter {
  static DIMENSION_AUTO = DIMENSION_AUTO

  constructor(width = 0, height = 0, options = 0) {
    super()
    this.options = options
    this.width = width
    this.height = height

    if (this.options & DIMENSION_AUTO) {
      window.addEventListener('resize', this.onWindowResize, false)
      this.onWindowResize()
    }
  }

  dispose() {
    super.dispose()
    window.removeEventListener('resize', this.onWindowResize)
  }

  onWindowResize = () => {
    this._width = window.innerWidth
    this._height = window.innerHeight
    this.emit('change', this)
  }

  set width(width) {
    this._width = width
    this.emit('change', this)
  }

  set height(height) {
    this._height = height
    this.emit('change', this)
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }
}

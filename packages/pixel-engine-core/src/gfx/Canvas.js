export const CANVAS_APPEND = 1 << 0
export const CANVAS_2D_CONTEXT = 1 << 1
export const CANVAS_GL_CONTEXT = 1 << 2

export default class Canvas {
  static CANVAS_APPEND = CANVAS_APPEND
  static CANVAS_2D_CONTEXT = CANVAS_2D_CONTEXT
  static CANVAS_GL_CONTEXT = CANVAS_GL_CONTEXT

  constructor(dimension, options = 0, view = document.createElement('canvas')) {
    this.view = view
    this.options = options
    this.setDimension(dimension)

    if (this.options & CANVAS_2D_CONTEXT) {
      this.ctx = this.view.getContext('2d')
    }
    if (this.options & CANVAS_GL_CONTEXT) {
      this.ctx = this.view.getContext('webgl')
    }
    if (this.options & CANVAS_APPEND) {
      document.body.appendChild(this.view)
    }
  }

  getBoundingClientRect() {
    return this.view.getBoundingClientRect()
  }

  addInputManager(inputManager, setup = true) {
    inputManager.setCanvas(this, setup)
    return inputManager
  }

  onDimensionChange = dimension => {
    this.view.width = dimension.width
    this.view.height = dimension.height
  }

  getContext() {
    if (this.options & CANVAS_2D_CONTEXT) {
      return this.ctx
    }
    if (this.options & CANVAS_GL_CONTEXT) {
      return this.gl
    }
    return null
  }

  setDimension(dimension) {
    if (this.dimension) {
      this.dimension.off('change', this.onDimensionChange)
    }
    this.dimension = dimension
    this.dimension.on('change', this.onDimensionChange)
    this.onDimensionChange(this.dimension)
  }
}

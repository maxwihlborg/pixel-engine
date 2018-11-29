export default class Canvas {
  constructor(wrapper) {
    this.wrapper = wrapper
    this.view = wrapper.querySelector('canvas')
    this.ctx = this.view.getContext('2d')
    this.wrapper.appendChild(this.view)
    this.resizeCanvas()

    window.addEventListener('resize', () => {
      this.resizeCanvas()
      this.onResize([this.view.width, this.view.height])
    })
  }

  addInputListener(inputListener) {
    this.input = inputListener
    this.input.setupMouseEvents(this.view)

    return inputListener
  }

  resizeCanvas() {
    const bbox = this.wrapper.getBoundingClientRect()
    this.view.width = bbox.width
    this.view.height = bbox.height
    this.ctx.imageSmoothingEnabled = false
  }
}

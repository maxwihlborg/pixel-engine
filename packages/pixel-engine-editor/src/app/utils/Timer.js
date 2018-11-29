export default class Timer {
  constructor() {
    this.running = false
    this.raf = null
  }

  start(cb) {
    if (this.running) {
      return
    }
    this.running = true
    let then = performance.now()
    const loop = now => {
      if (this.running) {
        this.raf = requestAnimationFrame(loop)
      }
      cb((now - then) / 1000)
      then = now
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }
}

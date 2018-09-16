import time from './time'

export default class Timer {
  constructor(fps = -1, frameSkip = 5) {
    this.fps = fps
    this.frameSkip = frameSkip
    this.accTime = 0
    this.running = false
  }

  start(cb) {
    if (this.running) {
      return
    }
    this.running = true
    let then = window.performance.now()
    const loop = now => {
      if (this.running) {
        this.raf = window.requestAnimationFrame(loop)
      }
      this.sync(time.toSec(now - then), cb)
      then = now
    }
    this.raf = window.requestAnimationFrame(loop)
  }

  sync(dt, cb) {
    if (this.fps < 0) {
      cb(dt, true)
      return
    }
    this.accTime += dt
    const invFps = 1 / fps
    const updates = Math.floor(this.accTime / invFps)
    if (updates > 0) {
      this.accTime -= updates * invFps
      for (let i = Math.min(updates, this.frameSkip) - 1; i >= 0; i--) {
        cb(invFps, i === 0)
      }
    }
  }

  stop() {
    this.running = false
    this.accTime = 0
    window.cancelAnimationFrame(this.raf)
  }
}

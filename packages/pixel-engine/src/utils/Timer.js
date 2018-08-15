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

  set fps(fps) {
    this._fps = fps
    this.invFps = 1 / fps
  }

  sync(dt, cb) {
    // Free sync
    if (this.fps < 0) {
      cb(dt, false)
    }
    this.accTime += dt
    const updates = Math.floor(this.accTime / this._invFps)
    if (updates > 0) {
      this.accTime -= updates * this._invFps
      let realUpdates = Math.min(updates, this.frameSkip)
      while (realUpdates > 0) {
        realUpdates -= 1
        cb(this._invFps, !(realUpdates === 0))
      }
    }
  }

  stop() {
    this.running = false
    this.accTime = 0
    window.cancelAnimationFrame(this.raf)
  }
}

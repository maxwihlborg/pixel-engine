import Timer from '../utils/Timer'

export default class Game {
  constructor(fps, frameSkip) {
    this.timer = new Timer(fps, frameSkip)
  }

  start() {
    this.timer.start(this.tick.bind(this))
  }

  stop() {
    this.timer.stop()
  }

  tick() {}
}

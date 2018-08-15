const time = {
  ms(ms) {
    return ms
  },
  sec(sec) {
    return sec * 1000
  },
  min(min) {
    return this.sec(min * 60)
  },
  toMs(ms) {
    return ms
  },
  toSec(ms) {
    return ms / 1000
  },
  toMin(ms) {
    return this.toSec(ms) / 60
  },
}

export default time

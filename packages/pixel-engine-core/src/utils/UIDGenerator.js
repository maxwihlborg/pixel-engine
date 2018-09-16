export default class UIDGenerator {
  constructor() {
    this.counter = 0
  }

  next() {
    let nextUID = this.counter + 1
    this.counter = nextUID % Number.MAX_SAFE_INTEGER
    return nextUID
  }
}

export default class EventEmitter {
  constructor() {
    this.eventListeners = new Map()
  }

  dispose() {
    this.eventListeners.clear()
  }

  emit(evt, ...args) {
    if (this.eventListeners.has(evt)) {
      this.eventListeners.get(evt).forEach(cb => {
        cb(...args)
      })
    }
    return this
  }

  on(evt, cb) {
    if (!this.eventListeners.has(evt)) {
      this.eventListeners.set(evt, new Set())
    }
    this.eventListeners.get(evt).add(cb)
    return this
  }

  once(evt, cb) {
    const fn = (...args) => {
      cb(...args)
      this.off(evt, fn)
    }
    this.on(evt, fn)
    return this
  }

  off(evt, cb) {
    if (!this.eventListeners.has(evt)) {
      return this
    }
    this.eventListeners.get(evt).delete(cb)
    if (!this.eventListeners.get(evt).size) {
      this.eventListeners.delete(evt)
    }
    return this
  }
}

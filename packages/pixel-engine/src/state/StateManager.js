export default class StateManager {
  constructor() {
    this.states = new Map()
    this.next = false
    this.current = false
  }

  add(name, state) {
    this.states.set(name, state)
    if (!this.current) {
      this.current = this.states.get(name)
      this.current.onEnter()
    }
    return this
  }

  set(name) {
    this.next = name
    return this
  }

  delete(name) {
    this.states.delete(name)
    return this
  }

  getCurrent() {
    if (this.next) {
      if (this.current) {
        this.current.onLeave()
      }
      this.current = this.states.get(this.next)
      this.current.onEnter()
      this.next = false
    }
    return this.current
  }
}

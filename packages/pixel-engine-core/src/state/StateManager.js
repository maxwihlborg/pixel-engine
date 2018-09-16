export default class StateManager {
  constructor() {
    this.states = new Map()
    this.currentState = null
    this.nextState = false
  }

  get(name) {
    if (!name) {
      return this.current()
    }
    return this.states.get(name)
  }

  add(name, state) {
    this.states.set(name, state)
    if (!(this.nextState && this.currentState)) {
      this.set(name)
    }
    return this
  }

  set(name) {
    if (!this.states.has(name)) {
      throw new Error(`No state with name: ${name}`)
    }
    this.nextState = name
    return this
  }

  current() {
    if (this.nextState !== false) {
      if (this.currentState) {
        this.currentState.onLeave()
      }
      this.currentState = this.states.get(this.nextState)
      this.currentState.onEnter()
      this.nextState = false
    }
    return this.currentState
  }
}

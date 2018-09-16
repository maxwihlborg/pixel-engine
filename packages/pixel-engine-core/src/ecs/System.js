export default class System {
  constructor() {
    this.entities = []
    this.isUpdating = false
    this._dirty = []
  }

  setManager(manager) {}

  hasEntity(entity) {
    return this.entities.indexOf(entity) !== -1
  }

  addEntity(entity) {
    if (!this.hasEntity(entity)) {
      this.onEnter(entity)
      this.entities.push(entity)
    }
  }

  test() {
    return false
  }

  lock() {
    this.isLocked = true
  }

  unlock() {
    this.isLocked = false
    if (this._dirty.length) {
      this._dirty.forEach(idx => {
        this.entities.splice(idx, 1)
      })
      this._dirty = []
    }
  }

  removeEntity(entity) {
    const idx = this.entities.indexOf(entity)
    if (idx !== -1) {
      this.onLeave(entity)
      if (this.isLocked) {
        this._dirty.push(idx)
      } else {
        this.entities.splice(idx, 1)
      }
    }
  }

  clearEntities() {
    this.entities = []
  }

  onEnter() {}

  onLeave() {}

  shouldUpdate() {
    return true
  }

  shouldRender() {
    return true
  }

  beforeUpdate() {}

  afterUpdate() {}

  beforeRender() {}

  afterRender() {}

  updateEntities(...args) {
    this.lock()
    for (let i = 0; i < this.entities.length; i++) {
      this.update(this.entities[i], ...args)
    }
    this.unlock()
  }

  renderEntities(...args) {
    this.lock()
    for (let i = 0; i < this.entities.length; i++) {
      this.render(this.entities[i], ...args)
    }
    this.unlock()
  }
}

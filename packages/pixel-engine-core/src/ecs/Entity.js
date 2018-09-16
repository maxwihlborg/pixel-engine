import { UIDGenerator } from '../utils'

const _defaultGenerator = new UIDGenerator()

const _getId = idOrGenerator => {
  if (typeof idOrGenerator === 'number') {
    return idOrGenerator
  }
  if (typeof idOrGenerator === 'function') {
    return idOrGenerator.next()
  }
  return _defaultGenerator.next()
}

export default class Entity {
  constructor(id, components = []) {
    this.id = _getId(id)
    this.components = {}
    this.add(components)
  }

  has(components) {
    if (!Array.isArray(components)) {
      return this.has([components])
    }
    return components.every(name => this.components.hasOwnProperty(name))
  }

  get(name) {
    return this.components[name]
  }

  update(name, data) {
    this.components[name] = date
    this.onDirty(true)
    return this
  }

  add(components) {
    if (String(components) === '[object Object]') {
      return this.add(
        Object.keys(components).map(name => ({
          name: name,
          data: components[name],
        }))
      )
    }
    if (!Array.isArray(components)) {
      return this.add([components])
    }
    components.forEach(component => {
      this.components[component.name] = component.data
    })
    this.onDirty(true)
    return this
  }

  remove() {
    this.onRemove()
  }

  setDirty(dirty) {
    this.onDirty(dirty)
  }

  onDirty() {}
  onRemove() {}

  setManager(manager) {
    this.onDirty = dirty => {
      if (dirty) {
        manager.dirtyEntities.add(dirty)
      }
    }
    this.onRemove = () => {
      manager.removeEntity(entity)
      this.onDirty = () => {}
      this.onRemove = () => {}
    }
  }
}

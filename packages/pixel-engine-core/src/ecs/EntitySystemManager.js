import Entity from './Entity'

export default class EntitySystemManager {
  constructor() {
    this.systems = new Map()
    this.updateSystems = new Set()
    this.renderSystems = new Set()
    this.dirtyEntities = new Set()
    this.entities = []
  }

  add(name, system) {
    this.systems.set(name, system)
    system.setManager(this)
    if (typeof system.update === 'function') {
      this.updateSystems.add(system)
    }
    if (typeof system.render === 'function') {
      this.renderSystems.add(system)
    }
    return this
  }

  hasEntity(entity) {
    return this.entities.indexOf(entity) !== -1
  }

  createEntity(components) {
    return this.addEntity(new Entity(null, components))
  }

  addEntity(entity) {
    if (!this.hasEntity(entity)) {
      this.entities.push(entity)
      entity.setManager(this)
      this.systems.forEach(system => {
        if (system.test(entity)) {
          system.addEntity(entity)
        }
      })
    }
    return entity
  }

  removeEntity(entity) {
    const idx = this.entities.indexOf(entity)
    if (idx !== -1) {
      this.systems.forEach(system => {
        if (system.test(entity)) {
          system.removeEntity(entity)
        }
      })
      this.entities.splice(idx, 1)
    }
    return entity
  }

  clearEntities() {
    this.entities = []
    this.systems.forEach(system => {
      system.clearEntities()
    })
  }

  cleanDirtyEntities() {
    if (this.dirtyEntities.size) {
      this.dirtyEntities.forEach(entity => {
        this.systems.forEach(system => {
          const hasEntity = system.hasEntity(entity)
          const shouldHaveEntity = system.test(entity)

          if (!hasEntity && shouldHaveEntity) {
            system.addEntity(entity)
          } else if (hasEntity && !shouldHaveEntity) {
            system.removeEntity(entity)
          }
        })
        entity.setDirty(false)
      })
      this.dirtyEntities.clear()
    }
  }

  get(name) {
    return this.systems.get(name)
  }

  update(...args) {
    this.updateSystems.forEach(system => {
      if (system.shouldUpdate(...args)) {
        system.beforeUpdate(...args)
        system.updateEntities(...args)
        system.afterUpdate(...args)
        this.cleanDirtyEntities()
      }
    })
  }

  render(...args) {
    this.renderSystems.forEach(system => {
      if (system.shouldRender(...args)) {
        system.beforeRender(...args)
        system.renderEntities(...args)
        system.afterRender(...args)
        this.cleanDirtyEntities()
      }
    })
  }
}

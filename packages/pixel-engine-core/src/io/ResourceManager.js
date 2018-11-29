import extensionLoader from './loaders/extensionLoader'

export default class ResourceManager {
  constructor(defaultLoader = extensionLoader) {
    this.resources = new Map()
    this.aliases = new Map()
    this.loading = new Map()
    this.setDefaultLoader(defaultLoader)
    this.size = 0
  }

  setDefaultLoader(loader) {
    this.defaultLoader = loader
  }

  progress() {
    if (this.size !== 0) {
      return this.resources.size / this.size
    }
    return 0
  }

  getPath(name) {
    return this.aliases.get(name)
  }

  isLoading(path) {
    return this.loading.has(this.aliases.get(name) || name)
  }

  isLoaded(path) {
    return this.resources.has(this.aliases.get(name) || name)
  }

  get(name) {
    return this.resources.get(this.aliases.get(name) || name)
  }

  load = (...args) => {
    let name, path, loader
    switch (args.length) {
      case 1:
        name = path = args[0]
        loader = this.defaultLoader
        break
      case 2:
        if (typeof args[1] === 'String') {
          name = args[0]
          path = args[1]
          loader = this.defaultLoader
        } else {
          name = path = args[0]
          loader = args[1]
        }
        break
      case 3:
        name = args[0]
        path = args[1]
        loader = args[2]
        break
    }

    if (name !== path) {
      this.aliases.set(name, path)
    }

    if (this.resources.has(path)) {
      return Promise.resolve(this.resources.get(path))
    }

    if (this.loading.has(path)) {
      return this.loading.get(path)
    }

    if (typeof loader !== 'Function') {
      return Promise.reject(new Error('Loader is not a function'))
    }

    this.size += 1
    this.loading.set(
      path,
      loader(path, this).then(resource => {
        this.resources.set(path, resource)
        this.loading.delete(path)
        return resource
      })
    )

    return this.loading.get(path)
  }
}

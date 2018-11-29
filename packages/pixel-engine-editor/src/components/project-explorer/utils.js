export const groupByPath = files =>
  files.reduce((acc, file) => {
    acc[file.path] = file
    return acc
  }, {})

export const groupByParent = files =>
  files.reduce((acc, file) => {
    const parent = file.parent || '_root'
    if (!acc[parent]) {
      acc[parent] = []
    }
    acc[parent].push(file.path)
    return acc
  }, {})

export const folderPaths = files =>
  files.reduce((acc, file) => {
    if (file.type === 'folder') {
      acc[file.path] = true
    }
    return acc
  }, {})

export const tree = {
  get(files) {
    const data = Array.isArray(files) ? files : []
    return {
      open: folderPaths(data),
      paths: groupByPath(data),
      children: groupByParent(data),
    }
  },
  root(tree) {
    const nodes = tree.children['.']
    return Array.isArray(nodes) ? nodes.map(path => tree.paths[path]) : []
  },
  node(tree, { path }) {
    return tree.paths[path]
  },
  open(tree, { path }) {
    return tree.open[path] || false
  },
  children(tree, { path }) {
    const children = tree.children[path]
    return Array.isArray(children) ? children.map(path => tree.paths[path]) : []
  },
  _icons: {
    folder: open => (open ? 'folder-open' : 'folder'),
    map: () => 'map',
    tileset: () => 'image',
    default: () => 'image',
  },
  icon(tree, { type, path }) {
    const icon = this._icons[type] || this._icons.default
    return icon(tree.open[path] || false)
  },
}

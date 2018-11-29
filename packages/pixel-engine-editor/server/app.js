const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const strip = require('strip-path')
const route = require('koa-route')
const getPort = require('get-port')
const chokidar = require('chokidar')
const websockify = require('koa-websocket')

const app = websockify(new Koa())

app.use(
  route.get('/', async ctx => {
    ctx.body = { hello: 'world!' }
  })
)

const combineHandlers = handlers => (ctx, evt, data) => {
  for (let i = 0; i < handlers.length; i++) {
    const resp = handlers[i](ctx, evt, data)
    if (resp === null || !!resp) {
      return resp
    }
  }
  return null
}

const handle = () => ({
  _callbacks: {},
  on(evt, cb) {
    this._callbacks[evt] = cb
    return this
  },
  create() {
    return (ctx, evt, data) => {
      if (!!this._callbacks[evt]) {
        return this._callbacks[evt](ctx.websocket, data)
      }
    }
  },
})

const getName = url => path.basename(url).replace(/\.\w+?$/, '')

const files = {
  _files: {},
  _listeners: {},
  add(path, type) {
    if (!this._files[path]) {
      this._files[path] = {
        type: type,
        name: getName(path),
        path: path,
      }
      this.emit('add', this._files[path])
    } else {
      this.emit('change', this._files[path])
    }
  },
  remove(path) {
    if (!!this._files[path]) {
      this.emit('delete', this._files[path])
      delete this._files[path]
    }
  },
  list() {
    return Object.values(this._files)
  },
  emit(evt, data) {
    if (!this._listeners[evt]) {
      return
    }
    this._listeners[evt].forEach(cb => cb(data))
  },
  on(evt, cb) {
    if (!this._listeners[evt]) {
      this._listeners[evt] = []
    }
    this._listeners[evt].push(cb)
  },
  off(evt, cb) {
    if (!this._listeners[evt]) {
      return
    }
    const idx = this._listeners[evt].indexOf(cb)
    if (idx !== -1) {
      this._listeners[evt].splice(idx, 1)
    }
    if (!this._listeners[evt].length) {
      delete this._listeners[evt]
    }
  },
}
const assetDir = path.join(process.cwd(), 'res')
const onFile = filePath => {
  fs.readFile(filePath, (err, res) => {
    const relPath = `./${strip(filePath, assetDir)}`
    if (err) {
      files.remove(relPath)
    } else {
      try {
        const data = JSON.parse(res)
        if (['tileset', 'map', 'atlas'].includes(data._type)) {
          files.add(relPath, data._type)
        } else {
          files.remove(relPath)
        }
      } catch (e) {
        files.remove(relPath)
      }
    }
  })
}
const watcher = chokidar
  .watch(path.join(assetDir, '**/*.json'))
  .on('change', onFile)
  .on('add', onFile)
  .on('unlink', filePath => {
    const relPath = `./${strip(filePath, assetDir)}`
    files.remove(relPath)
  })

const fileHandle = handle()
  .on('@socket:files:list', (ctx, data) => {
    return files.list()
  })
  .on('@socket:files:create', (ctx, data) => {})
  .on('@socket:files:update', (ctx, data) => {})
  .on('@socket:files:delete', (ctx, data) => {})
  .on(
    '@socket:files:rename',
    (ctx, { path: oldPath, name }) =>
      new Promise((resolve, reject) => {
        const newBase = name + path.extname(oldPath)
        const newPath = path.join(path.dirname(oldPath), newBase)
        fs.rename(
          path.join(assetDir, oldPath),
          path.join(assetDir, newPath),
          err => {
            if (err) {
              return reject(err)
            }
            resolve({ status: 'success' })
          }
        )
      })
  )
  .create()

app.ws.use(
  route.all('/', ctx => {
    const message = (name, data = {}) => JSON.stringify([name, data])

    const onAdd = obj =>
      ctx.websocket.send(message('@socket:files:create', obj))
    const onChange = obj =>
      ctx.websocket.send(message('@socket:files:change', obj))
    const onRemove = obj =>
      ctx.websocket.send(message('@socket:files:delete', obj))

    files.on('add', onAdd)
    files.on('change', onChange)
    files.on('delete', onRemove)

    ctx.websocket.on('close', () => {
      files.off('add', onAdd)
      files.off('change', onChange)
      files.off('delete', onRemove)
    })

    ctx.websocket.send(
      message('@socket:connected', {
        status: 'success',
      })
    )
    const handle = combineHandlers([fileHandle])
    ctx.websocket.on('message', async msg => {
      try {
        const [evt, data] = JSON.parse(msg)
        const resp = await handle(ctx, evt, data)
        if (resp !== null) {
          ctx.websocket.send(message(evt, resp))
        }
      } catch (e) {
        console.log(e)
      }
    })
  })
)

if (!module.parent) {
  getPort({ port: [3000, 3030] }).then(port => {
    console.log(`> Listening on port ${port}`)
    app.listen(port)
  })
}

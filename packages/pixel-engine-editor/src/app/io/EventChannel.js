export default class EventChannel {
  constructor(url) {
    this._listeners = new Map()
    this._messages = new Set()
    this._socketConnected = false

    if (typeof WebSocket === 'undefined') {
      console.error('WebSocket support is required')
    } else {
      this.socket = new WebSocket(url)
      this.socket.addEventListener('message', e => {
        try {
          const [evt, data] = JSON.parse(e.data)
          this.dispatch(evt, data)
        } catch (e) {}
      })
      this.socket.addEventListener('open', () => {
        this._socketConnected = true
        if (this._messages.size) {
          this._messages.forEach(msg => this.socket.send(msg))
          this._messages.clear()
        }
      })
    }
  }

  async send(evt, data = {}) {
    const msg = JSON.stringify([evt, data])
    if (this.socket && this._socketConnected) {
      this.socket.send(msg)
    } else if (!this._socketConnected) {
      this._messages.add(msg)
    }
    return new Promise(resolve => this.once(evt, data => resolve(data)))
  }

  dispatch(evt, ...args) {
    if (this._listeners.has(evt)) {
      this._listeners.get(evt).forEach(cb => cb(...args))
    }
  }

  on(evt, cb) {
    if (!this._listeners.has(evt)) {
      this._listeners.set(evt, new Set())
    }
    this._listeners.get(evt).add(cb)
  }

  once(evt, cb) {
    const fn = (...args) => {
      cb(...args)
      this.off(evt, fn)
    }
    this.on(evt, fn)
  }

  off(evt, cb) {
    if (!this._listeners.has(evt)) {
      return
    }
    this._listeners.get(evt).delete(cb)
    if (!this._listeners.get(evt).size) {
      this._listeners.delete(evt)
    }
  }
}

export const Keys = {
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_SPACE: 32,
}

export const Buttons = {
  BUTTON_LEFT: 0,
  BUTTON_MIDDLE: 1,
  BUTTON_RIGHT: 2,
  BUTTON_1: 0,
  BUTTON_2: 1,
  BUTTON_3: 2,
}

for (let i = 65; i <= 90; i++) {
  Keys[`KEY_${String.fromCharCode(i).toUpperCase()}`] = i
}

export default class InputManager {
  static Keys = Keys
  static Buttons = Buttons

  constructor(actionMap, setup = true) {
    this.state = {
      down: new Set(),
      pressed: new Set(),
      released: new Set(),
      nextPressed: new Set(),
      nextReleased: new Set(),
    }
    this.bindings = new Map()
    if (!!actionMap) {
      this.bindKeys(actionMap)
    }
    if (setup) {
      this.setupEventListeners()
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)

    if (this.canvas) {
      document.addEventListener('mouseup', this.onKeyDown, false)
      this.canvas.view.addEventListener('mousedown', this.onKeyDown, false)
      this.canvas.view.addEventListener('mouseup', this.onKeyUp, false)
      this.canvas.view.addEventListener('contextmenu', this.onKeyDown, false)
    }
  }

  getState() {
    const { pressed, released, nextPressed, nextReleased } = this.state

    if (pressed.size) {
      pressed.clear()
    }

    if (released.size) {
      released.clear()
    }

    if (nextPressed.size) {
      nextPressed.forEach(action => {
        pressed.add(action)
      })
      nextPressed.clear()
    }

    if (nextReleased.size) {
      nextReleased.forEach(action => {
        released.add(action)
      })
      nextReleased.clear()
    }

    return this
  }

  down(action) {
    return this.state.down.has(action)
  }

  pressed(action) {
    return this.state.pressed.has(action)
  }

  released(action) {
    return this.state.released.has(action)
  }

  addToCanvas(canvas, setup = true) {
    this.dispose()

    this.canvas = canvas

    if (setup) {
      this.setupEventListeners()
    }
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)

    if (this.canvas) {
      document.removeEventListener('mouseup', this.onKeyDown, false)
      this.canvas.view.removeEventListener('mousedown', this.onKeyDown)
      this.canvas.view.removeEventListener('mouseup', this.onKeyUp)
      this.canvas.view.removeEventListener('contextmenu', this.onKeyDown)
    }
  }

  bindKey(action, keyOrKeys) {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys]
    keys.forEach(key => {
      if (this.bindings.has(key)) {
        // TODO: Warn allready bound
      }
      this.bindings.set(key, action)
    })
  }

  bindKeys(actionMap) {
    Object.keys(actionMap).forEach(action => {
      this.bindKey(action, actionMap[action])
    })
  }

  getBinding(key) {
    return this.bindings.get(key)
  }

  getKeyFromEvent(e) {
    switch (e.type) {
      case 'keydown':
      case 'keyup':
        return e.keyCode
      case 'mousedown':
        return e.button
    }
  }

  onKeyDown = e => {
    e.preventDefault()
    e.stopPropagation()
    const action = this.getBinding(this.getKeyFromEvent(e))
    if (action && !this.down(action)) {
      this.state.nextPressed.add(action)
      this.state.down.add(action)
    }
  }

  onKeyUp = e => {
    e.preventDefault()
    e.stopPropagation()
    const action = this.getBinding(this.getKeyFromEvent(e))
    if (action && this.down(action)) {
      this.state.nextReleased.add(action)
      this.state.down.delete(action)
    }
  }
}

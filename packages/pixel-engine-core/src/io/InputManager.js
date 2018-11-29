import vec2, { X, Y } from '../math/vec2'

export const Keys = {
  KEY_BACKSPACE: 8,
  KEY_TAB: 9,
  KEY_ENTER: 13,
  KEY_SHIFT: 16,
  KEY_CTRL: 17,
  KEY_ALT: 18,
  KEY_BREAK: 19,
  KEY_PAUSE: 19,
  KEY_CAPS_LOCK: 20,
  KEY_ESC: 27,
  KEY_SPACE: 32,
  KEY_PAGE_UP: 33,
  KEY_PAGE_DOWN: 34,
  KEY_END: 35,
  KEY_HOME: 36,
  KEY_LEFT: 37,
  KEY_UP: 38,
  KEY_RIGHT: 39,
  KEY_DOWN: 40,
  KEY_INSERT: 45,
  KEY_DELETE: 46,
  KEY_COMMAND: 91,
  KEY_LEFT_COMMAND: 91,
  KEY_RIGHT_COMMAND: 93,
  KEY_WINDOWS: 91,
}

export const Buttons = {
  BUTTON_LEFT: 0,
  BUTTON_MIDDLE: 1,
  BUTTON_RIGHT: 2,
  BUTTON_1: 0,
  BUTTON_2: 1,
  BUTTON_3: 2,
  BUTTON_4: 3,
  BUTTON_5: 4,
}

export const CodeMap = {}

for (let i = 65; i <= 90; i++) {
  const key = String.fromCharCode(i).toUpperCase()
  Keys[`KEY_${key}`] = i
  CodeMap[`Key${key}`] = i
}

export default class InputManager {
  static Keys = Keys
  static CodeMap = CodeMap
  static Buttons = Buttons

  constructor(actionMap, setup = true) {
    this.state = {
      down: new Set(),
      pressed: new Set(),
      released: new Set(),
      nextMouse: vec2.create(0, 0),
      nextPressed: new Set(),
      nextReleased: new Set(),
    }
    this.mouse = {
      pressed: this.pressed.bind(this),
      down: this.down.bind(this),
      released: this.released.bind(this),
      position: vec2.create(),
      delta: vec2.create(0, 0),
    }
    this.bindings = new Map()
    if (!!actionMap) {
      this.bindActions(actionMap)
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
      this.canvas.view.addEventListener('mousemove', this.onMouseMove, false)
      this.canvas.view.addEventListener('mousedown', this.onKeyDown, false)
      this.canvas.view.addEventListener('mouseup', this.onKeyUp, false)
      this.canvas.view.addEventListener('contextmenu', this.onKeyDown, false)
    }
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)

    if (this.canvas) {
      document.removeEventListener('mouseup', this.onKeyDown)
      this.canvas.view.removeEventListener('mousemove', this.onMouseMove)
      this.canvas.view.removeEventListener('mousedown', this.onKeyDown)
      this.canvas.view.removeEventListener('mouseup', this.onKeyUp)
      this.canvas.view.removeEventListener('contextmenu', this.onKeyDown)
    }
  }

  getState() {
    const {
      down,
      pressed,
      released,
      nextPressed,
      nextReleased,
      nextMouse,
    } = this.state

    if (pressed.size) {
      pressed.clear()
    }
    if (nextPressed.size) {
      nextPressed.forEach(action => {
        pressed.add(action)
        down.add(action)
      })
      nextPressed.clear()
    }

    if (released.size) {
      released.clear()
    }
    if (nextReleased.size) {
      nextReleased.forEach(action => {
        down.delete(action)
        released.add(action)
      })
      nextReleased.clear()
    }

    vec2.set(
      this.mouse.delta,
      vec2.sub(vec2.clone(nextMouse), this.mouse.position)
    )
    vec2.set(this.mouse.position, nextMouse)

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

  setCanvas(canvas, setup = true) {
    this.canvas = canvas

    if (setup) {
      this.removeEventListeners()
      this.setupEventListeners()
    } else {
      this.removeEventListeners()
    }
  }

  bindAction(action, keys) {
    if (!Array.isArray(keys)) {
      return this.bindAction(action, [keys])
    }
    keys.forEach(key => {
      if (this.bindings.has(key)) {
        console.warn(
          `Key allready bound, key: ${key}, previous: ${this.bindings.get(
            key
          )}, next: ${action}`
        )
      }
      this.bindings.set(key, action)
    })
    return this
  }

  bindActions(actionMap) {
    Object.keys(actionMap).forEach(action => {
      this.bindAction(action, actionMap[action])
    })
    return this
  }

  getBinding(key) {
    return this.bindings.get(key)
  }

  getKeyFromEvent(e) {
    switch (e.type) {
      case 'keydown':
      case 'keyup':
        if (e.code && InputManager.CodeMap[e.code]) {
          return InputManager.CodeMap[e.code]
        }
        return e.keyCode
      case 'mousedown':
      case 'mouseup':
      case 'contextmenu':
        return e.button
    }
  }

  onMouseMove = e => {
    if (this.canvas) {
      const bounds = this.canvas.getBoundingClientRect()
      this.state.nextMouse[X] = e.clientX - bounds.left
      this.state.nextMouse[Y] = e.clientY - bounds.top
    }
  }

  onKeyDown = e => {
    e.preventDefault()
    e.stopPropagation()
    const action = this.getBinding(this.getKeyFromEvent(e))
    if (action && !this.down(action)) {
      this.state.nextPressed.add(action)
    }
  }

  onKeyUp = e => {
    e.preventDefault()
    e.stopPropagation()
    const action = this.getBinding(this.getKeyFromEvent(e))
    if (action && this.down(action)) {
      this.state.nextReleased.add(action)
    }
  }
}

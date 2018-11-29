import vec2 from '../math/vec2'

const codeFromEvent = e => {
  switch (e.type) {
    case 'keydown':
    case 'keyup':
      return e.keyCode
    case 'contextmenu':
    case 'mouseup':
    case 'mousedown':
      return e.button
  }
}

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
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
}

for (let i = 65; i <= 90; i++) {
  Keys[`KEY_${String.fromCharCode(i)}`] = i
}

export default class InputListener {
  static Keys = Keys
  static Buttons = Buttons

  constructor(actionMap = {}) {
    this.bindings = new Map()
    this.state = {
      down: new Set(),
      pressed: new Set(),
      released: new Set(),
      nextMouse: vec2.create(0, 0),
      nextPressed: new Set(),
      nextReleased: new Set(),
    }

    this.listening = true

    this.mouse = {
      delta: vec2.create(0, 0),
      position: vec2.create(0, 0),
    }

    this.bindActions(actionMap)
  }

  listen(listen = true) {
    this.listening = listen
  }

  getState() {
    const {
      down,
      pressed,
      released,
      nextMouse,
      nextPressed,
      nextReleased,
    } = this.state

    if (pressed.size) {
      pressed.clear()
    }

    if (nextPressed.size) {
      nextPressed.forEach(action => {
        down.add(action)
        pressed.add(action)
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

  bindAction(action, keyOrKeys) {
    if (!Array.isArray(keyOrKeys)) {
      return this.bindAction(action, [keyOrKeys])
    }
    keyOrKeys.forEach(key => {
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

  setupChannel(channel) {
    const re = new RegExp('^@')
    for (const key of this.bindings.keys()) {
      if (re.test(key)) {
        channel.on(key, () => {
          const action = this.bindings.get(key)
          if (action && !this.down(action)) {
            this.state.nextPressed.add(action)
            this.state.nextReleased.add(action)
          }
        })
      }
    }
  }

  setupMouseEvents(node) {
    this.dispose()
    this.node = node
    this.setupListeners()
  }

  onMouse = e => {
    const bbox = this.node.getBoundingClientRect()
    vec2.set(
      this.state.nextMouse,
      vec2.sub([e.clientX, e.clientY], [bbox.x, bbox.y])
    )
  }

  onKeyDown = e => {
    if (!this.listening) {
      return
    }
    if (e.type === 'contextmenu') {
      e.preventDefault()
    }
    const action = this.bindings.get(codeFromEvent(e))
    if (action && !this.down(action)) {
      this.state.nextPressed.add(action)
    }
  }

  onKeyUp = e => {
    const action = this.bindings.get(codeFromEvent(e))
    if (action && this.down(action)) {
      this.state.nextReleased.add(action)
    }
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

  setupListeners() {
    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)

    if (!!this.node) {
      this.node.addEventListener('mousemove', this.onMouse, false)
      this.node.addEventListener('mouseenter', this.onMouse, false)
      this.node.addEventListener('mouseleave', this.onMouse, false)
      this.node.addEventListener('contextmenu', this.onKeyDown, false)
      this.node.addEventListener('mousedown', this.onKeyDown, false)
      this.node.addEventListener('mouseup', this.onKeyUp, false)
      document.addEventListener('mouseup', this.onKeyUp, false)
    }
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)

    if (!!this.node) {
      this.node.removeEventListener('mousemove', this.onMouse)
      this.node.removeEventListener('mouseenter', this.onMouse)
      this.node.removeEventListener('mouseleave', this.onMouse)
      this.node.removeEventListener('mousedown', this.onKeyDown)
      this.node.removeEventListener('mouseup', this.onKeyUp)
    }
  }
}

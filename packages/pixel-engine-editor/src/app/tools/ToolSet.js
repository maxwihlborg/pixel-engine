import keyboard from 'keyboardjs'

export default class ToolSet {
  constructor(tools) {
    const toolMap = tools.reduce((acc, tool) => {
      return acc.concat([[tool.name, tool]])
    }, [])

    this.tools = new Map(toolMap)
    this._list = toolMap.map(tool => tool[0])
    this.currentTool = !!this.tools.size && this.get(toolMap[0][0])
    this._next = false
    this.tileset = null
  }

  setupChannel(channel) {
    channel.on('@tileset:change', tileset => {
      this.tileset = tileset
    })
    channel.on('@tools:set', tool => {
      if (this.tools.has(tool) && this.get(tool).active) {
        this.set(tool)
      }
    })
    this.tools.forEach(tool => {
      tool.setupChannel(channel)
      tool.hotkeys.forEach(key => {
        keyboard.bind(key, () => {
          channel.dispatch('@tools:set', tool.name)
        })
      })
    })

    this.onChange = () => {
      channel.dispatch('@tools:change', this.list())
    }

    this.onChange()
  }

  onChange() {}

  list() {
    return this._list.map(name => this.get(name).list())
  }

  add(tool) {
    this.tools.set(tool.name, tool)
  }

  set(name) {
    if (this.tools.has(name)) {
      this._next = name
    }
  }

  get(name) {
    return this.tools.get(name)
  }

  current() {
    if (this._next) {
      const nextTool = this.get(this._next)
      if (this.currentTool) {
        this.currentTool.selected = false
        this.currentTool.onDeselect(nextTool)
      }
      if (nextTool) {
        nextTool.selected = true
        nextTool.onSelect(this.currentTool)
      }
      this.currentTool = nextTool
      this._next = false
      this.onChange()
    }
    return this.currentTool
  }
}

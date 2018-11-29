export default class Tool {
  static TOOL_TILE_LAYER = 1 << 0
  static TOOL_OBJECT_LAYER = 1 << 1

  constructor(name, { hotkey, mask = 0, icon }) {
    this.name = name
    this.icon = icon
    this.mask = mask
    this.active = true
    this.hotkeys = (Array.isArray(hotkey) ? hotkey : [hotkey]).filter(Boolean)
    this.selected = false
  }

  setupChannel(channel) {}

  onSelect(prevTool) {}

  onDeselect(nextTool) {}

  test(mask) {
    return (this.mask & mask) === this.mask
  }

  show() {
    this.active = true
  }

  hide() {
    this.active = false
  }

  list() {
    return {
      selected: this.selected,
      active: this.active,
      hotkeys: this.hotkeys,
      tooltip: this.hotkeys
        .reduce((acc, key) => acc.concat([`(${key})`]), [])
        .join(', '),
      icon: this.icon,
      name: this.name,
      mask: this.mask,
    }
  }

  update(camera, input, layer, layers) {}

  draw(ctx, camera) {}
}

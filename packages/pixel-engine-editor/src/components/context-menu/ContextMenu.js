import { h, Component } from 'preact'
import cn from 'classnames'
import './style.css'

export default class ContextMenu extends Component {
  state = {
    showMenu: false,
    x: 0,
    y: 0,
  }

  componentDidUpdate() {
    if (this.state.showMenu) {
      requestAnimationFrame(() => {
        const { x, y } = this.state
        const { top, left } = this.getPosition(x, y)
        requestAnimationFrame(() => {
          if (!this.menu) return
          this.menu.style.top = `${top}px`
          this.menu.style.left = `${left}px`
          this.menu.style.opacity = 1
          this.menu.style.pointerEvents = 'auto'
        })
      })
    } else {
      if (!this.menu) return
      this.menu.style.opacity = 0
      this.menu.style.pointerEvents = 'none'
    }
  }

  getPosition = (x = 0, y = 0) => {
    const position = {
      top: y,
      left: x,
    }

    if (!this.menu) return position

    const { innerWidth, innerHeight } = window
    const rect = this.menu.getBoundingClientRect()

    if (y + rect.height > innerHeight) {
      position.top -= rect.height
    }

    if (x + rect.width > innerWidth) {
      position.left -= rect.width
    }

    if (position.top < 0) {
      position.top =
        rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0
    }

    if (position.left < 0) {
      position.left =
        rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0
    }

    return position
  }

  onClick = action => e => {
    const { onClick } = this.props
    e.preventDefault()
    if (onClick) {
      const resp = onClick(action, ...this.state.args)
      if (resp && resp.then) {
        resp.then(() => this.onClose())
      } else {
        this.onClose()
      }
    }
  }

  bindEvents() {
    document.addEventListener('mousedown', this.checkOutside, false)
    document.addEventListener('scroll', this.onClose, false)
    document.addEventListener('contextmenu', this.onClose, false)
    window.addEventListener('resize', this.onClose, false)
  }

  unbindEvents() {
    document.removeEventListener('mousedown', this.checkOutside)
    document.removeEventListener('scroll', this.onClose)
    document.removeEventListener('contextmenu', this.onClose)
    window.removeEventListener('resize', this.onClose)
  }

  onOpen = (...args) => e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      showMenu: true,
      args: args,
      x: e.clientX,
      y: e.clientY,
    })
    this.bindEvents()
  }

  onClose = () => {
    if (!this.state.showMenu) return
    this.unbindEvents()
    this.setState({
      showMenu: false,
    })
  }

  checkOutside = e => {
    if (!(this.menu && this.menu.contains(e.target))) {
      this.onClose()
    }
  }

  componentWillUnmount() {
    this.unbindEvents()
  }

  renderMenu(menu) {
    const { showMenu } = this.state
    const style = {
      position: 'fixed',
      opacity: 0,
      pointerEvents: 'none',
    }
    return (
      <nav
        ref={nav => {
          this.menu = nav
        }}
        tabindex={-1}
        style={style}
        className={cn('context-menu', showMenu && 'is-open')}
      >
        {Array.isArray(menu)
          ? menu.map(({ name, action }) => (
              <li>
                <a href="" onClick={this.onClick(action)}>
                  {name}
                </a>
              </li>
            ))
          : null}
      </nav>
    )
  }

  render({ children, menu }) {
    return (
      <div>
        {children[0]({ openMenu: this.onOpen })}
        {this.renderMenu(menu)}
      </div>
    )
  }
}

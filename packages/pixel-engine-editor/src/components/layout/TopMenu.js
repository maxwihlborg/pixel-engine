import { h, Component } from 'preact'

const Divider = () => (
  <div className="layout__top-menu__divider"></div>
)

class TopMenu extends Component {

  static Divider = Divider

  render({ children }) {
    return <div className="layout__top-menu">{children}</div>
  }
}

export default TopMenu

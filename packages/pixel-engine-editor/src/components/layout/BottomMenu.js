import { h, Component } from 'preact'

class BottomMenu extends Component {
  render({ children }) {
    return <div className="layout__bottom-menu">{children}</div>
  }
}

export default BottomMenu

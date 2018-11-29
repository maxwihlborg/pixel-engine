import { h, Component } from 'preact'
import Container from '../panel/Container'

class LeftMenu extends Component {
  render({ children }) {
    return (
      <div className="layout__left-menu">
        <Container>{children}</Container>
      </div>
    )
  }
}

export default LeftMenu

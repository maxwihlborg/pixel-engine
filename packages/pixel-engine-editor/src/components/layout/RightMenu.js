import { h } from 'preact'
import Container from '../panel/Container'

const RightMenu = ({ children }) => (
  <div className="layout__right-menu">
    <Container>{children}</Container>
  </div>
)

export default RightMenu

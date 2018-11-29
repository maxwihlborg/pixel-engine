import { h } from 'preact'

const Content = ({ children, component = 'div',...other }) => h(
  component,
  {
    className:"layout__content",
    ...other
  },
  children
)

export default Content

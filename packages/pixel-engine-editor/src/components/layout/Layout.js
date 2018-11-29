import { h } from 'preact'

const Layout = ({ children, theme }) => (
  <div className={`layout ${theme}`}>{children}</div>
)

export default Layout

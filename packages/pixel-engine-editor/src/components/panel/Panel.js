import { h } from 'preact'
import './style.css'

const Panel = ({ children, title }) => (
  <div className="panel">
    <div className="panel__top">
      <span className="panel__title">{title}</span>
      <span className="panel__actions">
        <i className="fas fa-search" />
      </span>
    </div>
    <div className="panel__content-wrap">
      <div className="panel__content">{children}</div>
    </div>
  </div>
)

export default Panel

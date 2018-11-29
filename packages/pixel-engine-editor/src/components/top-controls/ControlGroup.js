import { h } from 'preact'
import cn from 'classnames'

const handleClick = (control, cb) => e => {
  e.preventDefault()
  if (cb && control.active) {
    cb(control)
  }
}

const ControlGroup = ({ controls, onClick }) => (
  <div className="control-group">
    {controls.map(control => (
      <a
        className={cn(
          'control',
          control.active && 'is-active',
          control.selected && 'is-selected'
        )}
        key={control.name}
        href=""
        title={control.tooltip}
        onClick={handleClick(control, onClick)}
      >
        <i className={`fas fa-${control.icon}`} />
      </a>
    ))}
  </div>
)

export default ControlGroup

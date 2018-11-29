import { h, Component } from 'preact'
import update from 'immutability-helper'
import ControlGroup from './ControlGroup'

class HistoryControls extends Component {
  state = {
    controls: [
      {
        name: 'undo',
        icon: 'arrow-left',
        tooltip: '(u)',
      },
      {
        name: 'redo',
        icon: 'arrow-right',
        tooltip: '(r)',
      },
    ],
    active: {
      undo: false,
      redo: false,
    },
  }

  onControlClick = control => {
    switch (control.name) {
      case 'undo':
        this.props.channel.dispatch('@control:history:undo', 'undo')
        break
      case 'redo':
        this.props.channel.dispatch('@control:history:redo', 'redo')
        break
    }
  }

  onHistoryChange = history => {
    this.setState({
      active: update(this.state.active, {
        undo: { $set: history.undo },
        redo: { $set: history.redo },
      }),
    })
  }

  componentDidMount() {
    this.props.channel.on('@control:history:change', this.onHistoryChange)
  }

  componentWillUnmount() {
    this.props.channel.on('@control:history:change', this.onHistoryChange)
  }

  render({}, { controls, active }) {
    return (
      <ControlGroup
        controls={controls.map(tool =>
          update(tool, {
            active: { $set: active[tool.name] },
          })
        )}
        onClick={this.onControlClick}
      />
    )
  }
}

export default HistoryControls

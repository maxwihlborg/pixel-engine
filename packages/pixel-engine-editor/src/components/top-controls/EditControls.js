import { h, Component } from 'preact'
import update from 'immutability-helper'
import ControlGroup from './ControlGroup'

class EditControls extends Component {
  state = {
    controls: [
      {
        name: 'cut',
        icon: 'cut',
        tooltip: '(x)',
      },
      {
        name: 'copy',
        icon: 'copy',
        tooltip: '(c)',
      },
      {
        name: 'paste',
        icon: 'paste',
        tooltip: '(p)',
      },
    ],
    active: {
      cut: false,
      copy: false,
      paste: false,
    },
    clipboard: [],
    selection: false,
  }

  onControlClick = control => {
    if (control.name === 'paste') {
      this.props.channel.dispatch('@tools:selection:set', this.state.clipboard)
      this.props.channel.dispatch('@tools:set', 'pencil')
    } else {
      this.props.channel.dispatch(`@control:edit:${control.name}`)
    }
  }

  onTool = tool => {
    const valid = tool === 'area' && this.state.selection
    this.setState({
      active: update(this.state.active, {
        cut: { $set: valid },
        copy: { $set: valid },
      }),
    })
  }

  onSelection = selection => {
    this.setState({
      selection: selection,
      active: update(this.state.active, {
        cut: { $set: selection },
        copy: { $set: selection },
      }),
    })
  }

  onClipBoard = clipboard => {
    this.setState({
      clipboard: clipboard,
      active: update(this.state.active, {
        paste: { $set: clipboard.length },
      }),
    })
  }

  componentDidMount() {
    this.props.channel.on('@control:edit:selection:set', this.onSelection)
    this.props.channel.on('@control:edit:clipboard:set', this.onClipBoard)
    this.props.channel.on('@tools:set', this.onTool)
  }

  componentWillUnmount() {
    this.props.channel.off('@control:edit:selection:set', this.onSelection)
    this.props.channel.off('@control:edit:clipboard:set', this.onClipBoard)
    this.props.channel.off('@tools:set', this.onTool)
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

export default EditControls

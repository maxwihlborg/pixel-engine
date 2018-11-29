import { h, Component } from 'preact'
import ControlGroup from './ControlGroup'

class ToolControls extends Component {
  state = {
    tools: [],
  }

  onTools = tools => {
    this.setState({
      tools: tools,
    })
  }

  onToolClick = tool => {
    this.props.channel.dispatch('@tools:set', tool.name)
  }

  componentDidMount() {
    this.props.channel.on('@tools:change', this.onTools)
  }

  componentWillUnmount() {
    this.props.channel.off('@tools:change', this.onTools)
  }

  render(_, { tools }) {
    return <ControlGroup controls={tools} onClick={this.onToolClick} />
  }
}

export default ToolControls

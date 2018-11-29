import { h, Component } from 'preact'
import ControlGroup from './ControlGroup'

class ProjectControls extends Component {
  controls = [
    {
      name: 'explore',
      icon: 'folder',
    },
    {
      name: 'save',
      icon: 'save',
    },
  ]

  render() {
    return <ControlGroup controls={this.controls} />
  }
}

export default ProjectControls

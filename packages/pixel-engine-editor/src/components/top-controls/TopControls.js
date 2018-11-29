import { h, Component } from 'preact'
import ProjectControls from './ProjectControls'
import EditControls from './EditControls'
import HistoryControls from './HistoryControls'
import ToolControls from './ToolControls'
import './style.css'

class TopControls extends Component {
  render({ channel }) {
    return (
      <div className="top-control">
        <ProjectControls channel={channel} />
        <span className="top-control__divider" />
        <EditControls channel={channel} />
        <span className="top-control__divider" />
        <HistoryControls channel={channel} />
        <span className="top-control__divider" />
        <ToolControls channel={channel} />
      </div>
    )
  }
}

export default TopControls

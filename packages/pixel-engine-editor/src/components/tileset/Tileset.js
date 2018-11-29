import { h, Component } from 'preact'
import Panel from '../panel/Panel'
import TilesetViewer from './tileset-viewer/TilesetViewer'
import './style.css'

export default class Tileset extends Component {
  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this.tileset = new TilesetViewer(this.base, this.props.channel)
  }

  render() {
    return (
      <Panel title="Tileset">
        <div className="tileset">
          <canvas className="tileset__canvas" width={0} height={0} />
        </div>
      </Panel>
    )
  }
}

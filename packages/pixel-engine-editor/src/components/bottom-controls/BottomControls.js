import { h, Component } from 'preact'
import ContextMenu from '../context-menu/ContextMenu'
import './style.css'

const zoomLevels = [500, 400, 300, 250, 200, 150, 100, 75, 50, 25].map(v => ({
  action: v / 100,
  name: `${v}%`,
}))

const ZoomSelect = ({ value, onChange }) => {
  return (
    <ContextMenu menu={zoomLevels} onClick={onChange}>
      {({ openMenu }) => (
        <button
          className="button"
          onContextMenu={openMenu()}
          onClick={openMenu()}
          style={{ width: 100 }}
        >
          {value * 100}%
        </button>
      )}
    </ContextMenu>
  )
}

export default class BottomControls extends Component {
  state = {
    position: false,
    zoom: '2',
    grid: true,
  }

  onZoomChange = zoom => {
    this.props.channel.dispatch('@app:zoom:set', parseFloat(zoom, 10))
  }

  onGridClick = () => {
    this.props.channel.dispatch('@app:grid:set', !this.state.grid)
  }

  onAppGrid = grid =>
    this.setState({
      grid: grid,
    })

  onAppZoom = zoom =>
    this.setState({
      zoom: zoom,
    })

  onToolPosition = position => {
    if (position !== false || !!this.state.position) {
      this.setState({
        position: position,
      })
    }
  }

  componentDidMount() {
    this.props.channel.on('@tools:position:set', this.onToolPosition)
    this.props.channel.on('@app:zoom:set', this.onAppZoom)
    this.props.channel.on('@app:grid:set', this.onAppGrid)
  }

  componentWillUnmount() {
    this.props.channel.off('@tools:position:set', this.onToolPosition)
    this.props.channel.off('@app:zoom:set', this.onAppZoom)
    this.props.channel.off('@app:grid:set', this.onAppGrid)
  }

  render({}, { position, zoom, grid }) {
    return (
      <nav className="bottom-controls">
        <ul className="_left">
          <li>{position ? `${position[0]}, ${position[1]}` : null}</li>
        </ul>
        <ul className="_right">
          <li>
            <button className="button" onClick={this.onGridClick}>
              <i
                className="fas fa-fw fa-th"
                style={{
                  color: grid ? '#fff' : '#676767',
                }}
              />
            </button>
          </li>
          <li>
            <ZoomSelect value={zoom} onChange={this.onZoomChange} />
          </li>
        </ul>
      </nav>
    )
  }
}

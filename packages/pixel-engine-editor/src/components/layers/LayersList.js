import { h, Component } from 'preact'

const dashCase = str =>
  String(str)
    .toLowerCase()
    .split(/[^\w]+/)
    .join('-')

export default class LayersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Array.isArray(props.layers) ? props.layers : [],
    }
  }

  onLayerClick = layer => e => {
    e.preventDefault()
  }

  renderLayer(layer) {
    return (
      <li key={`${layer.index}-${dashCase(layer.name)}`}>
        <a href="" onClick={this.onLayerClick(layer)}>
          <i className={`far fa-fw fa-${layer.visible ? 'eye' : 'eye-slash'}`} />
          <span>{layer.name}</span>
        </a>
      </li>
    )
  }

  render({}, { data }) {
    return (
      <ul className="layers">{data.map(layer => this.renderLayer(layer))}</ul>
    )
  }
}

import { h, Component } from 'preact'
import Panel from '../panel/Panel'
import LayersList from './LayersList'
import './style.css'

const layers = [
  {
    name: 'Test Layer',
    visible: true,
    index: 0,
  },
  {
    name: 'Test Layer 2',
    visible: false,
    index: 1,
  },
]

export default class Layers extends Component {
  render() {
    return (
      <Panel title="Layers">
        <LayersList layers={layers} />
      </Panel>
    )
  }
}

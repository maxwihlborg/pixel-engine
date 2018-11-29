import { h, Component } from 'preact'
import update from 'immutability-helper'
import Panel from '../panel/Panel'

export default class History extends Component {
  state = {
    history: [],
  }

  onHistoryPush = entry => {
    this.setState(
      update(this.state, {
        history: {
          $unshift: [entry],
        },
      })
    )
  }

  componentDidMount() {
    this.props.channel.on('@history:push', this.onHistoryPush)
  }

  componentWillUnmount() {
    this.props.channel.off('@history:push', this.onHistoryPush)
  }

  render({}, { history }) {
    return (
      <Panel title="History">
        <ul>
          {history.map((entry, i) => (
            <li key={i}>{entry.content}</li>
          ))}
        </ul>
      </Panel>
    )
  }
}

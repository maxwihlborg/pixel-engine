import { h, Component } from 'preact'
import Editor from './Editor'
import './style.css'

class Application extends Component {
  shouldComponentUpdate() {
    // Prevent the UI from updating
    return false
  }

  componentDidMount() {
    this.editor = new Editor(this.base, this.props.channel)
    this.editor.start()
    window.addEventListener('focus', this.editor.start.bind(this.editor))
    window.addEventListener('blur', this.editor.stop.bind(this.editor))
  }

  render() {
    return (
      <div className="editor">
        <canvas className="editor__canvas" />
      </div>
    )
  }
}

export default Application

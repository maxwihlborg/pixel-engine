import { h, Component } from 'preact'
import update from 'immutability-helper'
import ProjectList from './ProjectList'
import Panel from '../panel/Panel'
import './style.css'

const withParents = files => {
  const dirs = {}
  return Array.isArray(files)
    ? files
        .reduce((acc, file) => {
          const d = file.path.split('/').slice(0, -1)
          let dir = d.join('/')
          acc.push(
            update(file, {
              parent: { $set: dir },
            })
          )
          while (dir !== '.' && !dirs[dir] && d.length) {
            dirs[dir] = true
            acc.push({
              name: d.pop(),
              path: dir,
              type: 'folder',
              parent: (dir = d.join('/')),
            })
          }
          return acc
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name))
    : []
}

export default class ProjectExplorer extends Component {
  state = {
    raw: [],
    files: [],
  }

  onFileList = files => {
    this.setState({ files: withParents(files), raw: files })
  }

  onFileCreate = file => {
    const { raw } = this.state
    this.setState({
      files: withParents(raw.concat(file)),
      raw: raw.concat(file),
    })
  }

  onFileChange = file => {
    // TODO mark file dirty
  }

  onFileDelete = file => {
    const { raw } = this.state
    const nextFiles = raw.filter(({ path }) => path !== file.path)
    this.setState({
      files: withParents(nextFiles),
      raw: nextFiles,
    })
  }

  componentDidMount() {
    this.props.channel.send('@socket:files:list')
    this.props.channel.on('@socket:files:list', this.onFileList)
    this.props.channel.on('@socket:files:create', this.onFileCreate)
    this.props.channel.on('@socket:files:change', this.onFileChange)
    this.props.channel.on('@socket:files:delete', this.onFileDelete)
  }

  componentWillUnmount() {
    this.props.channel.off('@socket:files:list', this.onFileList)
    this.props.channel.off('@socket:files:create', this.onFileCreate)
    this.props.channel.off('@socket:files:change', this.onFileChange)
    this.props.channel.off('@socket:files:delete', this.onFileDelete)
  }

  render({ channel }, { files }) {
    return (
      <Panel title="Project Explorer">
        <div className="project-explorer">
          <ProjectList files={files} channel={channel} />
        </div>
      </Panel>
    )
  }
}

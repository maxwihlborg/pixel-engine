import { h, Component } from 'preact'
import cn from 'classnames'
import update from 'immutability-helper'
import { tree } from './utils'
import ContextMenu from '../context-menu/ContextMenu'

export default class ProjectList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: tree.get(props.files),
      rename: false,
      submitting: false,
    }

    this.contextMenu = [
      {
        action: '@open',
        name: 'Open',
      },
      {
        action: '@rename',
        name: 'Rename',
      },
      {
        action: '@delete',
        name: 'Delete',
      },
    ]
  }

  componentWillReceiveProps(nextProps) {
    const nextFiles = nextProps.files
    if (nextFiles !== this.props.files) {
      this.setState({
        data: tree.get(nextFiles),
      })
    }
  }

  onMenuClick = (action, path) => {
    switch (action) {
      case '@rename':
        return this.setState({
          rename: path,
        })
    }
  }

  onNodeClick = node => e => {
    e.preventDefault()
    const { data } = this.state
    switch (node.type) {
      case 'folder':
        this.setState({
          data: update(data, {
            open: { [node.path]: open => !open },
          }),
        })
        break
    }
  }

  onRenameKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const path = this.state.rename
      const name = String(e.target.value).trim()
      if (!(name && path)) {
        return this.setState({
          rename: false,
        })
      }
      this.setState({
        submitting: true,
        data: update(this.state.data, {
          paths: { [path]: { name: { $set: name } } },
        }),
      })
      this.props.channel
        .send('@socket:files:rename', {
          path: path,
          name: name,
        })
        .then(() => {
          this.setState({ submitting: false, rename: false })
        })
    }
  }

  renderNode(data, node, openMenu) {
    if (!node) {
      return null
    }
    let children = null
    if (node.type === 'folder' && tree.open(data, node)) {
      children = (
        <ul>
          {tree
            .children(data, node)
            .map(child => this.renderNode(data, child, openMenu))}
        </ul>
      )
    }
    return (
      <li key={node.path}>
        <a
          href=""
          className="_node"
          onClick={this.onNodeClick(node)}
          onContextMenu={openMenu(node.path)}
        >
          <i className={`far fa-fw fa-${tree.icon(data, node)}`} />
          {this.state.rename === node.path ? (
            <input
              defaultValue={node.name}
              ref={el => {
                if (el) {
                  el.select()
                }
              }}
              disabled={this.state.submitting}
              onBlur={() =>
                this.setState(({ submitting }) => ({
                  rename: submitting,
                }))}
              onKeyDown={this.onRenameKeyDown}
            />
          ) : (
            <span>{node.name}</span>
          )}
        </a>
        {children}
      </li>
    )
  }

  render({}, { data, menu }) {
    return (
      <ContextMenu menu={this.contextMenu} onClick={this.onMenuClick}>
        {({ openMenu }) => (
          <ul className="project-list">
            {tree.root(data).map(node => this.renderNode(data, node, openMenu))}
          </ul>
        )}
      </ContextMenu>
    )
  }
}

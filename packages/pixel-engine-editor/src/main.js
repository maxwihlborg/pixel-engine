import './main.css'
import { h, render } from 'preact'

import {
  ProjectExplorer,
  BottomControls,
  TopControls,
  ActionMenu,
  ToolMenu,
  History,
  Tileset,
  Layout,
  Layers,
} from './components'
import EventChannel from './app/io/EventChannel'
import Application from './app'

const { TopMenu, Content, LeftMenu, Center, RightMenu, BottomMenu } = Layout

const channel = new EventChannel('ws://localhost:3000')

const App = () => {
  return (
    <Layout theme="dark">
      <TopMenu>
        <TopControls channel={channel} />
      </TopMenu>
      <Content channel={channel}>
        <LeftMenu>
          <ProjectExplorer channel={channel} />
          <History channel={channel} />
        </LeftMenu>
        <Center>
          <Application channel={channel} />
          <BottomMenu>
            <BottomControls channel={channel} />
          </BottomMenu>
        </Center>
        <RightMenu>
          <Tileset channel={channel} />
          <Layers channel={channel} />
        </RightMenu>
      </Content>
    </Layout>
  )
}

render(<App />, document.body)

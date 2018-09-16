import findUp from 'find-up'

import {
  PIXEL_DEFAULT_PORT,
  PIXEL_DEFAULT_ENTRY_FILE,
  PIXEL_DEFAULT_ASSETS_DIR,
  PIXEL_DEFAULT_TEMPLATE_FILE,
  PIXEL_DEFAULT_DIST_DIR,
  PIXEL_DEFAULT_NAME,
  PIXEL_CONFIG_FILE,
} from './constants'
import memoize from './memoize'

const defaultConfig = {
  port: PIXEL_DEFAULT_PORT,
  main: PIXEL_DEFAULT_ENTRY_FILE,
  assets: PIXEL_DEFAULT_ASSETS_DIR,
  template: PIXEL_DEFAULT_TEMPLATE_FILE,
  name: PIXEL_DEFAULT_NAME,
  dist: PIXEL_DEFAULT_DIST_DIR,
  webpack: null,
  plugins: [],
}

export const getUserConfig = memoize(async () => {
  const file = await findUp(PIXEL_CONFIG_FILE)
  return file ? require(file) : {}
})

export const getCombinedConfig = memoize(async (argv = {}, extraArgs = []) => {
  const userConfig = await getUserConfig()
  const argConfig = []
    .concat(['main', 'assets', 'name', 'template'])
    .concat(extraArgs)
    .filter(Boolean)
    .reduce((acc, key) => {
      if (argv[key]) {
        acc[key] = argv[key]
      }
      return acc
    }, {})

  return Object.assign({}, defaultConfig, userConfig, argConfig)
})

export default defaultConfig

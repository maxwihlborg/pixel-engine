import { join } from 'path'

export const PIXEL_DEFAULT_COMMAND = 'dev'

export const PIXEL_CONFIG_FILE = 'pixel.config.js'

export const PIXEL_ROOT = join(__dirname, '..', '..')
export const PIXEL_ROOT_NODE_MODULES = join(PIXEL_ROOT, 'node_modules')
export const PIXEL_ROOT_TEMPLATE = join(PIXEL_ROOT, 'dist', 'index.html')

export const PIXEL_DEFAULT_TEMPLATE_FILE = './index.html'
export const PIXEL_DEFAULT_ASSETS_DIR = './res'
export const PIXEL_DEFAULT_ENTRY_FILE = './src/main.js'
export const PIXEL_DEFAULT_DIST_DIR = './dist'
export const PIXEL_DEFAULT_NAME = 'Game'
export const PIXEL_DEFAULT_PORT = 1337

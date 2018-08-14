import { join } from 'path'
import { getUserConfig } from './config'
import memoize from './memoize'

export const getPlugins = memoize(async () => {
  const config = await getUserConfig()
  return Array.isArray(config.plugins)
    ? config.plugins.reduce((acc, path) => {
        try {
          const pkg = require(require.resolve(join(path, 'package.json')))
          if (pkg.bin) {
            return acc.concat(
              Object.keys(pkg.bin).map(cmd =>
                require.resolve(join(path, pkg.bin[cmd]))
              )
            )
          }
          return acc
        } catch (err) {
          switch (err.code) {
            case 'MODULE_NOT_FOUND':
              console.log('> Could not find plugin `' + path + '`')
              process.exit(1)
              return
          }
          throw err
        }
      }, [])
    : []
})

export const getCommands = memoize(async () => {
  const baseCommands = ['dev', 'build', 'start'].map(cmd =>
    join(__dirname, '../bin', `pixel-${cmd}`)
  )
  const plugins = await getPlugins()
  return [].concat(baseCommands).concat(plugins)
})

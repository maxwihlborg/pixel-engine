import fs from 'fs'
import path from 'path'
import serve from 'webpack-serve'
import webpack from 'webpack'
import getWebpackConfig from '../build/webpack'

export default async function startServer(dev, dir, config) {
  if (!fs.existsSync(path.join(dir, config.main))) {
    console.error(`> Main file not found ${config.main}`)
    process.exit(1)
  }
  const webpackConfig = await getWebpackConfig(dev, {
    dir: dir,
    config: config,
  })
  const compiler = webpack(webpackConfig)
  return new Promise((resolve, reject) => {
    serve(
      {
        logLevel: 'silent',
      },
      {
        host: config.host || 'localhost',
        port: config.port,
        compiler: compiler,
      }
    )
      .then(app => {
        let firstCompile = true
        app.on('error', err => reject(err))
        app.on('listening', () => resolve())
        app.on('build-finished', () => {
          if (firstCompile) {
            firstCompile = false
            console.log(`> Running on ${config.port}`)
          }
        })
      })
      .catch(err => reject(err))
  })
}

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import getWebpackConfig from '../build/webpack'

export default async function compile(dev, dir, config) {
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
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve(stats)
    })
  })
}

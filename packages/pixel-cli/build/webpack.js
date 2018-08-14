import fs from 'fs'
import path from 'path'
import WebpackBar from 'webpackbar'
import webpack from 'webpack'
import CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import InterpolateHTMLPlugin from 'interpolate-html-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import { PIXEL_ROOT_NODE_MODULES, PIXEL_ROOT_TEMPLATE } from '../lib/constants'

const kebabCase = str =>
  String(str)
    .split(/[^(\d\w)]+/g)
    .map(n => n.trim().toLowerCase())
    .join('-')

export default async function getWebpackConfig(dev, { dir, config }) {
  const alias = {}
  try {
    const pixelPath = require.resolve('@pixel/engine')
    alias.pixel = pixelPath
  } catch (err) {
    // continue
  }

  const defaultLoaders = {
    babel: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-runtime',
        ],
      },
    },
  }

  const template = fs.existsSync(path.join(dir, config.template))
    ? path.join(dir, config.template)
    : PIXEL_ROOT_TEMPLATE

  let webpackConfig = {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'cheap-module-source-map' : false,
    name: kebabCase(config.name),
    cache: true,
    target: 'web',

    entry: {
      [kebabCase(config.name)]: [
        dev && require.resolve('webpack-serve-overlay'),
        config.main,
      ].filter(Boolean),
    },

    output: {
      pathinfo: true,
      path: path.join(dir, config.dist),
      publicPath: '/',
      filename: dev ? 'js/[name].js' : 'js/[name]-[contenthash].js',
      strictModuleExceptionHandling: true,
    },

    resolveLoader: {
      modules: [PIXEL_ROOT_NODE_MODULES, 'node_modules'],
      alias: alias,
    },

    module: {
      rules: [
        {
          test: /\.(js|mjs)$/,
          include: dir,
          exclude: /node_modules/,
          use: defaultLoaders.babel,
        },
      ].filter(Boolean),
    },

    plugins: [
      !dev && new WebpackBar(),
      dev && new FriendlyErrorsWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: template,
        inject: true,
      }),
      new InterpolateHTMLPlugin({
        GAME_NAME: config.name,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          dev ? 'development' : 'production'
        ),
      }),
      new CaseSensitivePathPlugin(),
      dev && new webpack.NoEmitOnErrorsPlugin(),
      !dev &&
        fs.existsSync(path.join(dir, config.assets)) &&
        new CopyWebpackPlugin([
          {
            from: path.join(dir, config.assets),
            to: path.join(dir, config.dist, config.assets),
          },
        ]),
    ].filter(Boolean),
  }

  if (typeof config.webpack === 'function') {
    webpackConfig = await config.webpack(webpackConfig, {
      dir,
      dev,
      config,
      defaultLoaders,
    })
  }

  return webpackConfig
}

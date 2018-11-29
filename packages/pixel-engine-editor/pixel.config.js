const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  name: 'Pixel Editor',
  dist: './dist',
  webpack: (webpackConfig, { defaultLoaders, dev }) => {
    // Add preact loader
    defaultLoaders.babel.options.plugins.push([
      '@babel/plugin-transform-react-jsx',
      { pragma: 'h' },
    ])

    if (dev) {
      webpackConfig.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      })
    } else {
      webpackConfig.module.rules.push({
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      })
      webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'css/[name].css',
        })
      )
    }

    return webpackConfig
  },
}

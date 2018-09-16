# @pixel-engine/cli

Minimalist build tool inspired by [create-react-app][CRA] and [next.js][NEXTJS]

## Usage

#### Setup

Install

```bash
npm install @pixel-engine/cli --dev
```

And add scripts to your `package.json` like this

```json
{
  "scripts": {
    "dev": "pixel",
    "build": "pixel build",
    "start": "pixel start"
  }
}
```

After that create your entry file (default `./src/main.js`) and your up and running.

```js
// ./src/main.js

class Game {
  ...
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
}, false)
```

#### Static resources

Static resources are added in your assets directory (default `./res`) you then request the resources as you normally would, eg.

```js
const loadMap = () =>
  fetch('/res/map.json')
    .then(res => res.json())
    .then(data => new TileMap(data))

const loadImage = () =>
  new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = err => rej(err)
    img.src = '/res/myimage.png'
  })
```

#### Configuration

If the default folder structure don't work with your project, then you can configure some basic options in two ways.

Using a `pixel.config.js` file:

```js
module.exports = {
  main: './lib/index.js',
  assets: './assets',
}
```

Using cli options (inspect each command using the `--help, -h` flag):

```bash
npx pixel dev --main ./lib/index.js -p 9090
```

Options provided via cli arguments have higher precedence than options provided in the `pixel.config.js` file


## Options

| `pixel.config.js` property | CLI argument | Type          | Default       | Description                                               |
| :------------------------- | :----------- | :------------ | :------------ | :-------------------------------------------------------- |
| port                       | port, -p     | Number        | 1337          | Port number to run server at (webpack-serve option)       |
| host                       | hostname, -H | String        | localhost     | Host name to run the server at (webpack-serve option)     |
| main                       | main, -m     | String        | ./src/main.js | Entry file (webpack option)                               |
| assets                     | assets, -a   | String        | ./res         | Assets directory (copy-webpack-plugin option)             |
| template                   | template, -t | String        | ./index.html  | HTML template to use (html-webpack-plugin option)         |
| dist                       | dist, -d     | String        | ./dist        | Output directory when building (webpack option)           |
| plugins                    |              | Array<String> | []            | List of plugins (not used atm)                            |
| webpack                    |              | Function      | null          | Function that can be used to extend webpack configuration |

## Override webpack functionality

You can extend the webpack configuration by using the `pixel.config.js` file

```js
// pixel.config.js
const webpack = require('webpack')

module.exports = {
  /**
   * @param {Object} webpackConfig The webpack config object
   * @param {String} dir           Working dir
   * @param {Boolean} dev          Development or production mode
   * @param {Object} config        Configuration object as provided by
   *                               default options => pixel.config.js => cli args
   * @param {Object} defaultLoader Object with defaultLoaders
   */
  webpack: (webpackConfig, { dir, dev, config, defaultLoaders }) => {
    // Add the decorators plugin
    defaultLoaders.babel.options.plugins.push('@babel/plugin-proposal-decorators')

    if (!dev) {
      // Add a top banner to your minifed code
      webpackConfig.plugins.push(new webpack.BannerPlugin({
        banner: 'This is a minifed build of: ' +
          'https://github.com/you/your-awesome-oss-game-code'
      }))
    }

    return webpackConfig
  }
}
```

[CRA]: https://github.com/facebook/create-react-app
[NEXTJS]: https://github.com/zeit/next.js

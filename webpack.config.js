const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = (env, options) => {
  const loadPlugins = () => {
    if (options.mode === 'development') {
      return [
        new HtmlWebpackPlugin()
      ]
    }
    else {
      return [
        new HtmlWebpackPlugin({
          template: './templates/empty.html',
          inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackInlineSourcePlugin()
      ]
    }
  }

  return {
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, `dist/${options.mode}/`)
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.glsl$/,
          loader: 'webpack-glsl-loader'
        }
      ]
    },
    plugins: loadPlugins()
  }
}
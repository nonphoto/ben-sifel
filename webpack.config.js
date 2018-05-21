const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => {

  const isProduction = options.mode === 'production'

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
    plugins: [
      new HtmlWebpackPlugin()
    ]
  }
}
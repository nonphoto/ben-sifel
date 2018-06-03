const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const filename = 'bundle.js'

module.exports = (env, options) => {
  const isProduction = options.mode === 'production'

  const loadPlugins = () => {
    return [
      new HtmlWebpackPlugin({
        filename: `${options.mode}.html`,
        template: `./templates/${options.mode}.html`,
        inject: !isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  }

  return {
    entry: './src/main.js',
    output: {
      filename,
      path: path.resolve(__dirname, `dist/`)
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
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    plugins: loadPlugins()
  }
}
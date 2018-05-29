const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const filename = 'bundle.js'

module.exports = (env, options) => {
  const isProduction = options.mode === 'production'

  const loadPlugins = () => {
    return [
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
      new HtmlWebpackPlugin({
        template: `./templates/${options.mode}.html`,
      }),
      new ScriptExtHtmlWebpackPlugin({
        inline: isProduction ? filename : undefined,
      })
    ]
  }

  return {
    entry: './src/main.js',
    output: {
      filename,
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
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    },
    plugins: loadPlugins()
  }
}
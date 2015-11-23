'use strict'

let path = require('path')

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'main.js')
  ],
  output: {
    path: path.join(__dirname, 'target'),
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  debug: true,
  devtool: 'eval-source-map'
}

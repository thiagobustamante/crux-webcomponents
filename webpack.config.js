var path = require("path");
var webpack = require("webpack");
module.exports = {  
  context: __dirname + "/src",
  entry: {
    lib: ['./lib/crux-storyboard.ts', './lib/crux-breadcrumb.ts'],
    spec: ['./spec/crux-storyboard-test.ts', './spec/crux-breadcrumb-test.ts']
  },
  output: {
    path: path.resolve(__dirname, "release"),
    filename: '[name]/crux-components-[name].js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVICE_SIZE: JSON.stringify('large'),
      DEVICE_INPUT: JSON.stringify('no_touch')
    })
  ],
  devServer: { 
    inline: true 
  },
  resolve:{
    extensions: ['', '.ts', '.js', '.webpack.js', '.web.js']
  }
}
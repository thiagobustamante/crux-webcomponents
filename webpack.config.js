var path = require("path");
var webpack = require("webpack");
module.exports = {  
  context: __dirname + '/src',
  entry: {
    lib: ['./crux-storyboard.ts', './crux-breadcrumb.ts', './crux-swap-panel.ts']
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'crux-components-[name].js'
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        use: [{
          loader: 'ts-loader' 
        }]
      },
      { 
        test: /\.html$/, 
        use: [{
          loader: 'html-loader'
        }]
      },
      { 
        test: /\.css$/, 
        use: [{
          loader: 'css-loader' 
        }]
      }
    ]
  },
  devServer: { 
    inline: true 
  },
  resolve:{
    extensions: ['.ts', '.js', '.webpack.js', '.web.js']
  }
};

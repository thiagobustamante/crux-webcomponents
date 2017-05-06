'use strict'
var path = require("path");
var ClosureCompilerPlugin = require("webpack-closure-compiler");
var base = require("./webpack.config");

module.exports = Object.assign(base, {
  plugins: [
    new ClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            // language_out: 'ECMASCRIPT6',
            compilation_level: 'SIMPLE'
            // compilation_level: 'ADVANCED'
          },
          concurrency: 3,
    })
  ]
});

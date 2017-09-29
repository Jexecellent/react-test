const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const WebpackMd5Hash = require('webpack-md5-hash');
const baseWebpackConfig = require('./base.conf')


module.exports = function(env) {
  return webpackMerge(baseWebpackConfig, {
    entry: {
      'app': './script/index'
    },
    output: {
      // chunkFilename: "[chunkhash].[id].chunk.js",
      filename: 'script/[name]_[chunkhash:5].js',
      path: path.resolve(__dirname, '../dist/jddv3/'),
      publicPath: '/jddv3/'
    },
    module: {
      rules: [
        { test: /\.html$/, loader: "file-loader?name=[name].html" }
      ]
    },
    plugins: [
      new WebpackMd5Hash(),
      
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),

      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        },
      }),
      
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      }),
      
      new webpack.DllReferencePlugin({
        context:'.',
        manifest: require('../dll/manifest.json')
      })
    ]
  })
}
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./base.conf')
const path = require('path')

module.exports = function(env) {
  return webpackMerge(baseWebpackConfig, {
    entry: [
       'react-hot-loader/patch',
       // activate HMR for React

       'webpack-dev-server/client?http://localhost:3010',
       // bundle the client for webpack-dev-server
       // and connect to the provided endpoint

       'webpack/hot/only-dev-server',
       // bundle the client for hot reloading
       // only- means to only hot reload for successful updates

         './script/index'
       // the entry point of our app
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist/'),
      publicPath: '/jddv3/'
    },

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
        },
      ]
    },

    devtool: '#eval-source-map',

    devServer: {
      hot: true,

      // 开启服务器的模块热替换(HMR)
      port: 3010,
      
      disableHostCheck: true,

      host: "0.0.0.0",

      historyApiFallback:{
        rewrites: [
          { from: /\/*/, to: '/jddv3/main.html' }
        ]
      },
     // respond to 404s with main.html

      contentBase: path.resolve(__dirname, '../src/'),
      // 输出文件的路径
    },

    plugins: [

      new webpack.HotModuleReplacementPlugin(),
      // 开启全局的模块热替换(HMR)

      new webpack.NamedModulesPlugin(),
      // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    ]
  })

}
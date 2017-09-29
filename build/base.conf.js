const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractLess = new ExtractTextPlugin({
    filename: "style/app_[contenthash:5].css"
});
const extractCSSModule = new ExtractTextPlugin({
    filename: "style/base_[contenthash:5].css"
});

module.exports = {
  context: path.resolve(__dirname, '../src/jddv3'),
  
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader' 
      },
      {
        test: /\.less$/,
        include: [path.resolve(__dirname, '../src/jddv3/script'),path.resolve(__dirname, '../node_modules/@welab')],
        loaders: extractCSSModule.extract({
          fallback:'style-loader',
          use:[{loader:'css-loader?modules&importLoaders=1&localIdentName=[name]___[hash:base64:5]'}, //react css module 配置
          // 'resolve-url-loader',  //may need this (https://www.npmjs.com/package/resolve-url-loader)
          {loader:'px2rem-loader?remUnit=100'},
          {loader:'less-loader'}]
        })
      },
      {
        test: /\.less$/,
        include: [path.resolve(__dirname, '../src/jddv3/style')],
        loaders: extractLess.extract({
           use: ['css-loader' ,'px2rem-loader?remUnit=100','less-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2)$/i,
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
          test: require.resolve("../src/jddv3/script/helper/utils.js"),
          loader:  process.env['NODE_ENV']==='production' ? "imports-loader?env=>'prod'" : "imports-loader?env=>'dev'"
      }
    ]
  },

  plugins: [
      extractLess,
      extractCSSModule,
      new HtmlWebpackPlugin({
        domain: process.env['NODE_ENV']==='production'?'web.wolaidai.com':'webtest.wolaidai.com',
        filename: 'main.html',
        template: 'main.ejs' 
      })
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.less']
  }
}

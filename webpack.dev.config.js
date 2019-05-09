'use strict'
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
      pc : "./view/pc/app.js"
  },
  output: {
    path: path.resolve(__dirname, "./dist-front"),
    publicPath: '/',
    filename:'[name]/js/main-[hash:8].js'
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: "dist-front",
    openPage: "pc/index.html",
    historyApiFallback: {
      rewrites: [
        { from: /^\/pc/, to: '/pc/index.html' }
      ]
    },
    proxy: {
      '/getCaptcha': 'http://localhost:3000',
      '/postLogin': 'http://localhost:3000',
      '/postUpdate': 'http://localhost:3000',
      '/postUpdatePassword': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/workers': 'http://localhost:3000',
      '/postAddWorker': 'http://localhost:3000',
      '/delWorker': 'http://localhost:3000',
      '/updateWorker': 'http://localhost:3000',
      '/current': 'http://localhost:3000',
      '/enterDb': 'http://localhost:3000',
      '/poorCells': 'http://localhost:3000',
      '/excel/upload': 'http://localhost:3000',
      '/getAdds': 'http://localhost:3000',
      '/updateAddr': 'http://localhost:3000',
      '/getJobStateType': 'http://localhost:3000',
      '/postJobStateType': 'http://localhost:3000',
      '/delPoorCell': 'http://localhost:3000'
    },
    port: 3001
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        use: 'pug-plain-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(scss)$|\.(sass)$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: '/fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'pc/index.html',
      template: path.resolve(__dirname, "./view/pc/index.html"),
      inject: 'body'
    })
  ],
  watchOptions: {
    ignored: ['node_modules']
  }
}
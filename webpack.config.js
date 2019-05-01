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
      '/captcha': 'http://localhost:3000'
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
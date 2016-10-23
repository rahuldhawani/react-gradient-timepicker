const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
     new webpack.DefinePlugin({
       'process.env': {
         'NODE_ENV': JSON.stringify('production')
       }
     })
   ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
};
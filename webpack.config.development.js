module.exports = {
  devtool: 'inline-source-map',
  debug: true,
  entry: [
    './src/example/',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8787'
  ],
  output: {
    path: __dirname + '/src/',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8787/'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: './src',
    historyApiFallback: {
      index: '/example/index.html'
    }
  }
};

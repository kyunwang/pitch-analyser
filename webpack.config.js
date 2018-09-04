const path = require('path');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'pitch-analyser',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};

module.exports = config;

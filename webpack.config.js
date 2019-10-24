const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'client'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: 'dist/'
  },
  devServer: {
    overlay: true,
    host: 'localhost',
    port: 8080,
    hotOnly: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};
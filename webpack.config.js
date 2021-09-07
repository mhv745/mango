const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack')

const javascriptRules = {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options:{
          presets: [
            "@babel/preset-env",
            [
              '@babel/preset-react',
              {
                runtime: 'automatic'
              }
            ]
          ],
          "plugins": [
            "@babel/plugin-proposal-object-rest-spread"
          ]
        },
      }

const stylesRules = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

module.exports = (env, argv) => {

  return {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
      }),
    ],
    devtool: 'source-map',
    module: {
      rules: [
        javascriptRules,
        stylesRules
      ],
    },
    devServer: {
      open: true,
      compress: true,
      historyApiFallback: true,
    }
  }
};
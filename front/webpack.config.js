const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, 'src/app.tsx'),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js",
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: [/\.ts$/, /\.tsx$/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    // new ESLintPlugin({
    //   extensions: ["ts", "tsx", "js"],
    // }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
  },
}
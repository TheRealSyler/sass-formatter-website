import { resolve } from 'path';
import webpack = require('webpack');
import MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
import HtmlWebpackPlugin = require('html-webpack-plugin');
// import BAP = require('webpack-bundle-analyzer');

const config: webpack.Configuration = {
  entry: {
    'init-styles': './src/init-styles.ts',
    index: './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      },
      {
        test: /src.*\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loaders: ['arraybuffer-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist')
  },

  plugins: [
    // new BAP.BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new MonacoWebpackPlugin({ languages: [] })
  ]
};

export default config;

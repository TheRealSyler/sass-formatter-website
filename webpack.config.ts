import { resolve } from 'path';
import webpack = require('webpack');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config: webpack.Configuration = {
  entry: './src/index.ts',
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
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist')
  },
  plugins: [new HtmlWebpackPlugin(), new MonacoWebpackPlugin({ languages: [] })]
};

export default config;

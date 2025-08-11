// Frontend/webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    resolve: { extensions: ['.js', '.jsx'] },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: {
      static: path.join(__dirname, 'public'),
      historyApiFallback: true,
      port: 3000,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      ],
      open: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
      }),
    ],
    performance: { hints: false },
  };
};

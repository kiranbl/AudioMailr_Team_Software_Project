const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'components');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglify-js-plugin');

module.exports = {
    devtool: "eval-source-map",
    entry: __dirname + '/src/index.jsx',
//There is only one entry file for webpack, so all components written, even css/json, must be referenced here
output:{
    path: __dirname +'/public',
    filename: 'bundle.js',
},
//Created a new folder called public, used to put index.html and bundle.js
devServer: {
    contentBase: "./public",//The directory where the page loaded by the local server is located
    historyApiFallback: true,
    inline: true
},
plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
],
module: {
    loaders: [
   {
        test: /\.jsx$/,
        loader:'babel-loader',
        exclude: /node_modules/
    }, {
        test: /\.js$/,
        loader:'babel-loader',
        exclude: /node_modules/
    },{
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?modules','sass-loader'],
        exclude: /node_modules/
    },{
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules'],
    },{
        test: /\.(png|jpg|jpeg)$/,
        loader: 'file-loader'
    },{
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
    },{
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      }
      ]
},
resolve:{
        extensions: ['.js', '.jsx'],
        fallback: {
            'buffer': require.resolve('buffer/'),
            'querystring': require.resolve('querystring-es3'),
            'https': require.resolve('https-browserify/'),
            'url': require.resolve('url/'),
            'fs': false,
            'os': require.resolve('os-browserify/browser'),
            'stream': require.resolve('stream-browserify'),
            'crypto': require.resolve('crypto-browserify'),
            'path': require.resolve('path-browserify'),
            'util': require.resolve('util/'),
            'child_process': false,
        },
},
externals: {
    "jquery":"jQuery",
    "react":"React",
    "redux":"Redux",
    "react-dom" :"ReactDOM",
    "react-redux":"ReactRedux",
    "thunk":"ReduxThunk",
},
};
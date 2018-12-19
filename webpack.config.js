const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const OUTPUT_FOLDER = path.join(__dirname, 'dist')
const INDEX_HTML = path.join(__dirname, '/index.html')

module.exports = {
    entry: './src/index.js',
    output: {
        path: OUTPUT_FOLDER,
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader']
            },
        ],
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new CopyWebpackPlugin([{from: 'app.yaml'}]),
        new HtmlWebpackPlugin({template: INDEX_HTML}),
        new CleanWebpackPlugin([OUTPUT_FOLDER]),
    ],
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:3000/api",
                pathRewrite: {"^/api": ""},
            }
        }
    },
    devtool: 'source-map',
}

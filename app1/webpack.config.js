const path = require("path");
let webpack = require("webpack");
let extractTextPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebPackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
	entry: "./clientapp/index.js",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "./dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "./clientapp"),
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.vue$/,
				include: path.resolve(__dirname, "./clientapp"),
				loader: "vue-loader"
			},
			{
				test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
				use: {
					loader: "url-loader", options: {
						limit: "8192",
						fallback: "file-loader",
						filename: "[name].[ext]"
					}
				}
			},
			{
				test: /\.css$/,
				use: [extractTextPlugin.loader,
					"css-loader"
				]
			}

		]
	},
	devtool: '#source-map',
	plugins: [
		// new CleanWebPackPlugin([path.resolve(__dirname, './dist')]),
		new extractTextPlugin({
			filename: "[name].css"
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("development")
			}
		}),
		new webpack.DllReferencePlugin({
			manifest: require(`./dist/vendor.manifest.json`),
		}),
		new webpack.DllReferencePlugin({
			manifest: require(`./dist/main.manifest.json`),
			scope: "layout"
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new VueLoaderPlugin(),
		new WebpackBundleAnalyzer()
	]
}
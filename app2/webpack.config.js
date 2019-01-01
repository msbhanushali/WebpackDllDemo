const path = require("path");
let webpack = require("webpack");
let extractTextPlugin = require("mini-css-extract-plugin");
const CleanWebPackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
	entry: {
		main: ["@babel/polyfill", "./clientapp/index.js"],
		vendor: ["axios", "jquery"]
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "./dist"),
		library: "[name]_[hash]"
	},
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'all',
	// 		maxAsyncRequests: 20
	// 	}
	// },
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
		new CleanWebPackPlugin([path.resolve(__dirname, "./dist"), path.resolve(__dirname, "../app1/shared")]),

		new extractTextPlugin({
			filename: "[name].css"
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("development")
			}
		}),
		new webpack.DllPlugin({
			path: './dist/[name].manifest.json',
			name: '[name]_[hash]',
			context: "."
		}),

		new CopyWebpackPlugin([
			{ from: path.join(__dirname, "dist"), to: path.resolve(__dirname, '../app1/dist') }
		])
		// ,
		// new BundleAnalyzerPlugin()
	]
}
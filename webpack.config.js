/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
	entry: './src/extension/extension.ts',
	devtool: 'source-map',
	externals: {
		vscode: 'commonjs vscode',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			"url": require.resolve("url/"),
			"util": require.resolve("util/"),
			"os": require.resolve("os-browserify/browser"),
			"path": require.resolve("path-browserify"),
			"fs": false			
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(__dirname, 'src/extension/tsconfig.json'),
							projectReferences: true,
							compilerOptions: {
								module: 'esnext',
							},
						},
					},
				],
			},
		],
	},
};

const nodeConfig = {
	...config,
	target: 'node',
	output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
		path: path.resolve(__dirname, 'dist'),
		filename: 'extension-node.js',
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	}
};

const webConfig = {
	...config,
	target: 'webworker',
	output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
		path: path.resolve(__dirname, 'dist'),
		filename: 'extension-web.js',
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]",
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		})
	],
};

const rendererConfig = {
	...config,
	entry: './src/mlsql-notebook-renderer/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'renderer.js',
		libraryTarget: 'module',
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", '.css']
	},
	experiments: {
		outputModule: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(__dirname, 'src/mlsql-notebook-renderer/tsconfig.json'),
							projectReferences: true,
							compilerOptions: {
								module: 'esnext',
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
			},
		],
	}
};

const webviewConfig = {
	...config,
	entry: './src/common-webview/views.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'views.js',
		libraryTarget: 'module',
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", '.css']
	},
	experiments: {
		outputModule: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(__dirname, 'src/common-webview/tsconfig.json'),
							projectReferences: true,
							compilerOptions: {
								module: 'exnext',
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader',
			},
		],
	}
};

module.exports = [nodeConfig, rendererConfig, webviewConfig];

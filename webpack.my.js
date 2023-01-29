const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const glob = require('glob');

let entries = {};

// Javascript
glob.sync('./resources/js/*.js').map((file) => {
	const pattern = new RegExp('./resources/js');
	const f_name = path.dirname(file).replace(pattern, 'js') + '/' + path.basename(file, '.js');
	entries[f_name] = file;
})

// SCSS
glob.sync('./resources/scss/*.scss', {
	ignore: [
		'./resouces/scss/_*.scss',
		'./resources/scss/ignore/*'
	]
}).map((file) => {
	const pattern = new RegExp('./resources/scss');
	const f_name = path.dirname(file).replace(pattern, 'css') + '/' + path.basename(file).replace(new RegExp('.scss'), '');
	entries[f_name] = file;
})

let bundles = {};
for(let k in entries) {
	bundles[k + '.bundle'] = entries[k];
}

module.exports = {
	mode: 'development',
	entry: bundles,
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './public/assets')
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/react']
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							minimize: true
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							url: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							webpackImport: false,
							sassOptions: {
								includePaths: ['./node_modules', './resources/scss']
							},
							implementation: require('sass')
						}
					}
				]
			}
		]
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	]
}
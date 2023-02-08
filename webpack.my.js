const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const glob = require('glob');

let entries = {};

// Javascript
glob.sync('./resources/js/*.js').map((file) => {
	const pattern = new RegExp('./resources/js');
	const f_name = path.dirname(file).replace(pattern, 'js') + '/' + path.basename(file, '.js');
	entries[f_name] = {
		type: 'js',
		file: file
	};
})

// SCSS
glob.sync('./resources/sass/*.scss', {
	ignore: [
		'./resources/sass/_*.scss',
		'./resources/sass/ignore/*'
	]
}).map((file) => {
	const pattern = new RegExp('./resources/sass');
	const f_name = path.dirname(file).replace(pattern, 'css') + '/' + path.basename(file).replace(new RegExp('.scss'), '');
	entries[f_name] = {
		type: 'css',
		file: file
	};
})

// SCSS underlayer
glob.sync('./resources/sass/*/*.scss').map((file) => {
	const pattern = new RegExp('./resources/sass');
	const f_name = path.dirname(file).replace(pattern, 'css') + '/' + path.basename(file).replace(new RegExp('.scss'), '');
	entries[f_name] = {
		type: 'css',
		file: file
	};
})

let bundles = {};
for(let k in entries) {
	if(entries[k].type === 'js') {
		bundles[k + '.bundle'] = entries[k].file;
	} else {
		bundles[k] = entries[k].file;
	}
}

module.exports = {
	mode: 'development',
	entry: bundles,
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './public/assets')
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.scss']
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
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							//minimize: true
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							url: false,
							modules: true
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
							//webpackImport: false,
							sassOptions: {
								includePaths: ['./node_modules']
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
const path = require('path');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

const libraryTargets = ['var', 'commonjs2', 'amd', 'umd'];

const createConfig = (env, argv) => libraryTargets.map((target) => {
	const config = {
		entry: './src/index.js',
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: `pitch-analyser.${target}.js`,
			library: 'PitchAnalyser', // Because it's a class :shrug
			libraryTarget: target,
			libraryExport: 'default',
		},
		optimization: {
			minimizer: [],
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: 'babel-loader',
					exclude: /(node_modules|bower_components)/,
				},
			],
		},
	};

	if (argv.mode === 'development') {}

	if (argv.mode === 'production') {
		config.optimization.minimizer.push(new UglifyWebpackPlugin({ sourceMap: true }));
	}

	return config;
});

module.exports = (env, argv) => createConfig(env, argv);

module.exports = {
	entry: './src/app.js',
	output: {
		path: './bin',
		filename: 'app.bundle.js',
		sourceMapFilename: 'app.js.map'
	},
	devtool: "source-map"
};
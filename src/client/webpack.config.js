const path = require('path');

module.exports = {
	mode: 'development',
	entry: './js/test.js',
	output: {
		filename: 'test.js',
		path: path.resolve(__dirname, '..', '..', 'public', 'js'),
	},
	devtool: 'inline-source-map',
};

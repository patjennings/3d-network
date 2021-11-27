const path = require('path');

module.exports = {
    entry: './client/js/app.js',
    output: {
	path: path.resolve(__dirname, 'dist/js'),
	filename: 'bundle.js'
    },
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
		test: /\.scss$/,
		use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
		]
            }
        ]
    }
};

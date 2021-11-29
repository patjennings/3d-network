const path = require('path');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
    },
    optimization: {
	minimize: true,
	minimizer: [new TerserPlugin({
	    minify: TerserPlugin.uglifyJsMinify,
            // `terserOptions` options will be passed to `uglify-js`
            // Link to options - https://github.com/mishoo/UglifyJS#minify-options
            terserOptions: {
		mangle: {
		    toplevel: true
		},
		// keep_classnames: false,
                // keep_fnames: false
	    },
	    extractComments: true
	})],
    }
};

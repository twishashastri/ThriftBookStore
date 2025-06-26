const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point for the application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
    filename: 'bundle.js', // Output bundle file name
    publicPath: '/', // Public URL of the output directory when referenced in a browser
  },
  mode: 'development', // Set mode to development for easier debugging
  devServer: {
    static: './dist', // Serve static files from the dist directory
    historyApiFallback: true, // Redirect 404s to index.html for React Router
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transpile .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules from transpilation
        use: {
          loader: 'babel-loader', // Use Babel to transpile
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
  },
};

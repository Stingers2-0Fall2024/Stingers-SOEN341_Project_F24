const path = require('path');

module.exports = {
  entry: './index.js', // Adjust path to your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};

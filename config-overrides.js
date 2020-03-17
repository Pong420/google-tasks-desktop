const path = require('path');
const { override, addWebpackResolve } = require('customize-cra');

// TODO:
// @material-ui/core

module.exports = function(config, env) {
  return override(
    addWebpackResolve({
      alias: {
        fs: path.resolve(__dirname, 'mock-fs.js')
      }
    })
  )(config, env);
};

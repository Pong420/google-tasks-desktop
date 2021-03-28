const path = require('path');

/** @typedef {import('webpack').Configuration} Configuration */

/**
 * @param {Configuration} config
 * @param {*} env
 * @returns {Configuration}
 */
module.exports = function (config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    fs: path.resolve(__dirname, 'mock-fs.js')
  };

  config.module.rules = config.module.rules.map(r => {
    if (r.oneOf) {
      return {
        ...r,
        oneOf: r.oneOf.map(r => {
          if (Array.isArray(r.use)) {
            return {
              ...r,
              use: r.use.map(u =>
                typeof u === 'object' &&
                typeof u.options === 'object' &&
                u.loader.includes('sass-loader')
                  ? {
                      ...u,
                      options: {
                        ...u.options,
                        additionalData: `@import 'scss/index.scss';`,
                        sassOptions: {
                          includePaths: [path.resolve(__dirname, 'src')]
                        }
                      }
                    }
                  : u
              )
            };
          }
          return r;
        })
      };
    }
    return r;
  });

  return config;
};

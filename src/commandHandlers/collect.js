const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { services } = context();

  return services.collectFiles({
    onlyImages: !!argv['only-images'],
    dirpaths: [
      argv.dirpath,
    ],
  });
};

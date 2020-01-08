const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();

  return services.removeDoublesInDirectory({
    dirpath: argv.dirpath,
  }, {
    logger: loggers.fileRemoved,
  });
};

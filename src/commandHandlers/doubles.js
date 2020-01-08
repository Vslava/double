const path = require('path');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();

  const dirpath = argv.dirpath && path.resolve(argv.dirpath);

  return services.findDoubles({
    dirpath,
  }, {
    logger: loggers.doubleFiles,
  });
};

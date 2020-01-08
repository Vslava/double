const path = require('path');
const context = require('context');

module.exports = async (argv) => {
  const { services } = context();

  const dirpath = argv.dirpath && path.resolve(argv.dirpath);

  return services.findDoubles({
    dirpath,
  });
};

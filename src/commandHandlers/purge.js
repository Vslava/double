const context = require('context');

module.exports = async () => {
  const { loggers, services } = context();

  return services.purgeAbsentFiles({
    logger: loggers.purgedFile,
  });
};

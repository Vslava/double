const context = require('context');

module.exports = async () => {
  const { loggers, services } = context();
  const { handlerWrapper } = context().commandHandlers;

  await handlerWrapper(() => (
    services.purgeAbsentFiles({ logger: loggers.purgedFile })
  ));
};

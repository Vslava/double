const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { loggers, services } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

  await handlerWrapper(() => (
    services.purgeAbsentFiles({ logger: loggers.purgedFile })
  ));
};

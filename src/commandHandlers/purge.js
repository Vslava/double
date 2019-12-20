const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { commandHandlers, loggers } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

  await handlerWrapper(() => (
    context().services.purgeAbsentFiles({ logger: loggers.purgedFile })
  ), argv);
};

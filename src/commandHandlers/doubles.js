const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { commandHandlers, loggers, services } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

  await handlerWrapper(() => (
    services.findDoubles({ logger: loggers.doubleFiles })
  ), argv);
};

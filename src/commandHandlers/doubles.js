const path = require('path');
const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { commandHandlers, loggers, services } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

  const directoryPath = argv.dirpath && path.resolve(argv.dirpath);

  await handlerWrapper(() => (
    services.findDoubles({
      directoryPath,
    }, {
      logger: loggers.doubleFiles,
    })
  ), argv);
};

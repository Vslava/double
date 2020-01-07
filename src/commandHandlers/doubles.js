const path = require('path');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();
  const { handlerWrapper } = context().commandHandlers;

  const directoryPath = argv.dirpath && path.resolve(argv.dirpath);

  await handlerWrapper(() => (
    services.findDoubles({
      directoryPath,
    }, {
      logger: loggers.doubleFiles,
    })
  ));
};

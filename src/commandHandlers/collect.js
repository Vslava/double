const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();
  const { handlerWrapper } = context().commandHandlers;

  const commandLoggers = _.pick(loggers, [
    'fileAlreadyCollected',
    'fileProcessed',
  ]);

  await handlerWrapper(() => (
    services.collectFiles({
      onlyImages: !!argv['only-images'],
      dirpaths: [
        argv.dirpath,
      ],
    }, {
      loggers: commandLoggers,
    })
  ));
};

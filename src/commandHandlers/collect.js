const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { commandHandlers, loggers } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

  const collectLoggers = _.pick(loggers, [
    'fileAlreadyCollected',
    'fileProcessed',
  ]);

  await handlerWrapper(() => (
    context().services.collectFiles({
      onlyImages: !!argv['only-images'],
      dirpaths: [
        argv.dirpath,
      ],
    }, {
      loggers: collectLoggers,
    })
  ), argv);
};

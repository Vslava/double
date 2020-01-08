const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();

  const commandLoggers = _.pick(loggers, [
    'fileAlreadyCollected',
    'fileProcessed',
  ]);

  return services.collectFiles({
    onlyImages: !!argv['only-images'],
    dirpaths: [
      argv.dirpath,
    ],
  }, {
    loggers: commandLoggers,
  });
};

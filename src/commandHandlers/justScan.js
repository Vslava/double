const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();
  const { handlerWrapper } = context().commandHandlers;

  const commandLoggers = _.pick(loggers, [
    'fileWoDoubles',
    'fileWithDoubles',
  ]);

  await handlerWrapper(() => (
    services.scanFilesWoCollect({
      showDoubles: !!argv['show-doubles'],
      dirpath: argv.dirpath,
    }, {
      loggers: commandLoggers,
    })
  ));
};

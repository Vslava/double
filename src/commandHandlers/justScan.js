const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const { loggers, services } = context();

  const commandLoggers = _.pick(loggers, [
    'fileWoDoubles',
    'fileWithDoubles',
  ]);

  return services.scanFilesWoCollect({
    showDoubles: !!argv['show-doubles'],
    dirpath: argv.dirpath,
  }, {
    loggers: commandLoggers,
  });
};

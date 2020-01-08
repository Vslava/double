const _ = require('lodash');
const context = require('context');

module.exports = async () => {
  const { loggers, services } = context();

  const collectLoggers = _.pick(loggers, [
    'fileAbsent',
    'fileRescanned',
  ]);

  return services.rescanFiles({
    loggers: collectLoggers,
  });
};

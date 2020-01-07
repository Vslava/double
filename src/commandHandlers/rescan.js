const _ = require('lodash');
const context = require('context');

module.exports = async () => {
  const { loggers, services } = context();
  const { handlerWrapper } = context().commandHandlers;

  const collectLoggers = _.pick(loggers, [
    'fileAbsent',
    'fileRescanned',
  ]);

  await handlerWrapper(() => (
    services.rescanFiles({
      loggers: collectLoggers,
    })
  ));
};

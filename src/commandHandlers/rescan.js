const _ = require('lodash');
const context = require('context');

module.exports = async (argv) => {
  const ctx = context();
  const { loggers, services } = ctx;
  const { handlerWrapper } = ctx.commandHandlers;

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

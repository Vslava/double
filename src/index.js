const context = require('context');

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command({
    command: 'collect <dirpath>',
    desc: "Collect all files' information in the dirpath directory",
    builder: (yargs) => {
      yargs.positional('dirname', {
        describe: 'A directory where the files are placed',
        type: 'string',
      });
    },
    handler: async (argv) => context.services.collectFiles({
      dirpaths: [
        argv.dirpath,
      ],
    }),
  })
  .scriptName('doubler')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;

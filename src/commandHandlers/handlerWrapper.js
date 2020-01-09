module.exports = (handler) => (
  async (argv) => {
    await handler(argv);
    process.exit(0);
  }
);

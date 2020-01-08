module.exports = async (handler) => (
  async (argv) => {
    await handler(argv);
    process.exit(0);
  }
);

module.exports = async (handler) => {
  await handler();
  process.exit(0);
};

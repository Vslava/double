const fs = require('fs');

module.exports = async (filePath) => {
  const r = await fs.promises.access(filePath).catch((err) => err);
  return typeof r === 'undefined';
};

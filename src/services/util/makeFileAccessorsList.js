const context = require('context');

module.exports = ({ onlyImages }) => {
  const { services } = context();

  const fileAccessors = [];

  if (onlyImages) {
    fileAccessors.push(services.util.fileAccessors.image);
  }

  return fileAccessors;
};

module.exports = ({ filePath, doubleFilePaths = [] }) => {
  console.log('---', filePath);

  doubleFilePaths.forEach((doubleFilePath) => {
    console.log('   ', doubleFilePath);
  });
};

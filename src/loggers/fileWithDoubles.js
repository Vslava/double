module.exports = (originFilePath, doubleFilePaths = []) => {
  console.log('---', originFilePath);

  doubleFilePaths.forEach((doubleFilePath) => {
    console.log('   ', doubleFilePath);
  });
};

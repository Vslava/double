module.exports = (originFilePath, doubleFilePaths) => {
  console.log(`--- double files for: ${originFilePath}`);

  doubleFilePaths.forEach((doubleFilePath) => {
    console.log(doubleFilePath);
  });

  console.log('\n');
};

/* eslint-disable func-names */
const path = require('path');
const { assert, expect } = require('chai');
const appContext = require('context');

describe(__filename, () => {
  function checkFunction(cachedFiles) {
    return (dir, fileName, sign) => {
      const findFile = (filep) => cachedFiles.toArray().filter(
        (fileInfo) => (fileInfo.get('filepath') === filep),
      );

      assert.strictEqual(
        findFile(path.join(dir, fileName))[0].get('sign'),
        sign,
        `${fileName} wasn't signed correctly`,
      );
    };
  }

  const fileSigns = {
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
    'pic.png': '006321de634e21d0ba7ac4557e515887',
    file3: '02a73a746f187bbdee14bcf8b752d643',
    file4: '2241b4b34e81a6d0829e944f89a35d1e',
    'pic.jpeg': '7a86539287b66fcb477a754f7f861f6a',
    thesame1: 'b6ee2058d98027764d589b1e3a102c39',
  };

  const options = {
    loggers: {
      fileAlreadyCollected: () => {},
      fileProcessed: () => {},
    },
  };

  beforeEach(function () {
    const rootDir = path.join(this.fixtureDir, 'several_dirs');
    this.dir1 = path.join(rootDir, 'dir1');
    this.dir2 = path.join(rootDir, 'dir2');
    this.theSame = path.join(rootDir, 'the_same');
  });

  describe('process all files', () => {
    it('collect all files of the directories into the db', async function () {
      // init
      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [this.dir1, this.dir2],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      assert.strictEqual(cachedFiles.length, 6, 'A number of cached files are not correct');
      checkSign(this.dir1, 'file1', fileSigns.file1);
      checkSign(this.dir1, 'file2', fileSigns.file2);
      checkSign(this.dir1, 'pic.png', fileSigns['pic.png']);
      checkSign(this.dir2, 'file3', fileSigns.file3);
      checkSign(this.dir2, 'file4', fileSigns.file4);
      checkSign(this.dir2, 'pic.jpeg', fileSigns['pic.jpeg']);
    });
  });

  describe('process only images', () => {
    it('only collects image files from the directories into the db', async function () {
      // init
      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [this.dir1, this.dir2],
        onlyImages: true,
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      assert.strictEqual(cachedFiles.length, 2, 'A number of cached files are not correct');
      checkSign(this.dir1, 'pic.png', fileSigns['pic.png']);
      checkSign(this.dir2, 'pic.jpeg', fileSigns['pic.jpeg']);
    });
  });

  context('if some of the files were already collected', () => {
    it('ignores these files during file processing', async function () {
      // init
      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      await new File({
        filepath: path.join(this.dir1, 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join(this.dir2, 'file3'),
        sign: fileSigns.file3,
      }).save();

      // process
      await collectFiles({
        dirpaths: [this.dir1, this.dir2],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      assert.strictEqual(cachedFiles.length, 6, 'A number of cached files are not correct');
      checkSign(this.dir1, 'file1', fileSigns.file1);
      checkSign(this.dir1, 'file2', fileSigns.file2);
      checkSign(this.dir1, 'pic.png', fileSigns['pic.png']);
      checkSign(this.dir2, 'file3', fileSigns.file3);
      checkSign(this.dir2, 'file4', fileSigns.file4);
      checkSign(this.dir2, 'pic.jpeg', fileSigns['pic.jpeg']);
    });
  });

  context('when there is a file with the same sign', () => {
    it('collects it everyway', async function () {
      // init
      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [this.dir1, this.theSame],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      checkSign(this.dir1, 'file1', fileSigns.file1);
      checkSign(this.theSame, 'thesame1', fileSigns.thesame1);
    });
  });
});

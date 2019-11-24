/* eslint-disable func-names */
const path = require('path');
const assert = require('assert');
const sinon = require('sinon');
const appContext = require('context');

describe(__filename, () => {
  const fileSigns = {
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
    'pic.png': '006321de634e21d0ba7ac4557e515887',
    file3: '02a73a746f187bbdee14bcf8b752d643',
    file4: '2241b4b34e81a6d0829e944f89a35d1e',
    'pic.jpeg': '7a86539287b66fcb477a754f7f861f6a',
    thesame1: 'b6ee2058d98027764d589b1e3a102c39',
  };

  beforeEach(function () {
    const rootDir = path.join(this.fixtureDir, 'several_dirs');
    this.dir1 = path.join(rootDir, 'dir1');
    this.theSame = path.join(rootDir, 'the_same');
  });

  it('shows files which have doubles in the db', async function () {
    // init
    const { findDoubles } = appContext().services;
    const { File } = appContext().models;

    await new File({
      filepath: path.join(this.dir1, 'file1'),
      sign: fileSigns.file1,
    }).save();
    await new File({
      filepath: path.join(this.dir1, 'file2'),
      sign: fileSigns.file2,
    }).save();

    const consoleLogSpy = sinon.spy(console, 'log');

    // process
    await findDoubles({
      dirpaths: [this.theSame],
    });

    // check
    assert.strictEqual(consoleLogSpy.callCount, 3);
    assert.strictEqual(
      consoleLogSpy.getCall(0).args[0],
      `--- file: ${path.join(this.theSame, 'thesame1')} ---`,
    );
    assert.strictEqual(
      consoleLogSpy.getCall(1).args[0],
      `    has a double: ${path.join(this.dir1, 'file1')}`,
    );
    assert.strictEqual(
      consoleLogSpy.getCall(2).args[0],
      '\n',
    );
  });
});

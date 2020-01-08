const path = require('path');

global.FIXTURE_DIR = path.resolve('test/fixtures');

const rootDir = path.join(global.FIXTURE_DIR, 'several_dirs');

global.DIRS = Object.freeze({
  dir1: path.join(rootDir, 'dir1'),
  dir2: path.join(rootDir, 'dir2'),
  theSame: path.join(rootDir, 'the_same'),
});

global.FILE_SIGNS = Object.freeze({
  file1: 'b6ee2058d98027764d589b1e3a102c39',
  file2: '6174e909453ef9d1658f95856eea4c97',
  'pic.png': '006321de634e21d0ba7ac4557e515887',
  file3: '02a73a746f187bbdee14bcf8b752d643',
  file4: '2241b4b34e81a6d0829e944f89a35d1e',
  'pic.jpeg': '7a86539287b66fcb477a754f7f861f6a',
  thesame1: 'b6ee2058d98027764d589b1e3a102c39',
});

global.FILE_PATHS = Object.freeze({
  file1: path.join(global.DIRS.dir1, 'file1'),
  file2: path.join(global.DIRS.dir1, 'file2'),
  'pic.png': path.join(global.DIRS.dir1, 'pic.png'),
  file3: path.join(global.DIRS.dir2, 'file3'),
  file4: path.join(global.DIRS.dir2, 'file4'),
  'pic.jpeg': path.join(global.DIRS.dir2, 'pic.jpeg'),
  thesame1: path.join(global.DIRS.theSame, 'thesame1'),
});

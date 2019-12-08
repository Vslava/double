module.exports = (bookshelf) => (
  bookshelf.model('File', {
    tableName: 'files',
  }, {
    createNew(attrs) {
      return new this(attrs).save();
    },
    findAllKnex() {
      return this.query();
    },
    countByFilePath(filePath) {
      return this
        .where('filepath', filePath)
        .count();
    },
    findDoubleSignsKnex() {
      return this.query()
        .select('sign')
        .groupBy('sign')
        .havingRaw('COUNT(*) > 1');
    },
    findAllForSign(sign) {
      return this.where('sign', sign).fetchAll();
    },
    deleteById(id) {
      return new this({ id }).destroy();
    },
  })
);

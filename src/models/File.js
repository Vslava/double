const TABLE_NAME = 'files';

module.exports = (bookshelf) => {
  const { knex } = bookshelf;

  return bookshelf.model('File', {
    tableName: TABLE_NAME,
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
    findDoublesKnex() {
      return knex
        .raw(`
          SELECT *
            FROM ${TABLE_NAME}
            WHERE sign IN (
              SELECT sign
              FROM ${TABLE_NAME}
              GROUP BY sign
              HAVING COUNT(*) > 1
            )
            ORDER BY filepath
        `);
    },
    findAllForSign(sign) {
      return this
        .where('sign', sign)
        .orderBy('filepath')
        .fetchAll();
    },
    deleteById(id) {
      return new this({ id }).destroy();
    },
  })
};

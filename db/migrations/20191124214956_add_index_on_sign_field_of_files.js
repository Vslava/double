exports.up = (knex) => (
  knex.schema.table('files', (t) => {
    t.index('sign');
  })
);

exports.down = (knex) => (
  knex.schema.table('files', (t) => {
    t.dropIndex('sign');
  })
);

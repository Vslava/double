exports.up = (knex) => (
  knex.schema.createTable('files', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('md5').notNullable();

    t.timestamps(true, true);

    t.unique('md5');
  })
);

exports.down = (knex) => (
  knex.schema.dropTable('files')
);

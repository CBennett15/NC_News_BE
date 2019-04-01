exports.up = function(connection, Promise) {
  console.log('creating table..');
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable
      .string('slug')
      .primary()
      .notNullable();
    topicsTable.string('description');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping table...');
  return connection.schema.dropTable('topics');
};

exports.up = function(connection, Promise) {
  console.log('creating table..');
  return connection.schema.createTable('users', (usersTable) => {
    usersTable
      .string('username')
      .primary()
      .notNullable();
    usersTable.string('avatar_url');
    usersTable.string('name');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping table...');
  return connection.schema.dropTable('users');
};

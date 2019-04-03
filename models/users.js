const connection = require('../db/connection');
exports.getUsers = () => {
  return connection
    .select('*')
    .from('users')
    .returning('*');
};
exports.getUsersByUsername = ({ username }) => {
  return connection
    .select('*')
    .from('users')
    .where('username', '=', username)
    .returning('*');
};

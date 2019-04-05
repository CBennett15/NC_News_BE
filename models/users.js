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
exports.addUser = (req) => {
  const body = req.body;
  return connection
    .insert({
      username: body.username,
      name: body.name,
      avatar_url: body.avatar_url,
    })
    .into('users')
    .returning('*');
};

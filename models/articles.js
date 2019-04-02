const connection = require('../db/connection');

exports.getArticles = () => {
  return connection
    .select('*')
    .from('articles')
    .returning('*');
};

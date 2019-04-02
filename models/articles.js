const connection = require('../db/connection');

exports.getArticles = () => {
  return connection
    .select('*')
    .from('articles')
    .returning('*');
};

exports.getArticlesById = ({ articles_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', articles_id);
};

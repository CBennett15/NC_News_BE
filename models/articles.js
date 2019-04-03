const connection = require('../db/connection');

exports.getArticles = ({ username, topic, sort_by, order_by }) => {
  return connection
    .select('articles.*', 'comments.article_id')
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id')
    .orderBy(sort_by || 'created_at', order_by || 'desc')
    .modify(function(queryBuilder) {
      if (username) {
        queryBuilder.where('articles.author', username);
      }
    })
    .modify(function(queryBuilder) {
      if (topic) {
        queryBuilder.where('articles.topic', topic);
      }
    })
    .returning('*');
};

exports.getArticlesById = ({ articles_id }) => {
  return connection
    .select('articles.*', 'comments.article_id')
    .from('articles')
    .where('articles.article_id', '=', articles_id)
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id');
};

exports.updateArticle = (req) => {
  const id = req.params.articles_id;
  const inc_votes = req.body.inc_votes;
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', id)
    .increment('votes', inc_votes)
    .returning('*');
};

exports.deleteArticle = ({ articles_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', articles_id)
    .del();
};

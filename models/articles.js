const connection = require('../db/connection');

exports.getArticles = ({ author, topic, sort_by, order, limit, p }) => {
  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit || 10)
    .offset(p || 0)
    .modify(function(queryBuilder) {
      if (author) {
        queryBuilder.where('articles.author', author);
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
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', '=', articles_id)
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id')
    .returning('*');
};

exports.updateArticle = (req) => {
  const id = req.params.articles_id;
  const inc_votes = req.body.inc_votes;
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', id)
    .increment('votes', inc_votes || 0)
    .returning('*');
};

exports.deleteArticle = ({ articles_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', articles_id)
    .del();
};
exports.getCommentsByArticle = (req) => {
  const id = req.params.articles_id;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  return connection
    .select('comments.*')
    .from('comments')
    .where('articles.article_id', '=', id)
    .leftJoin('articles', 'comments.article_id', 'articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc');
};

exports.addComment = (req) => {
  const body = req.body;
  const id = req.params.articles_id;
  return connection
    .insert({
      author: body.username,
      article_id: id,
      created_at: new Date(),
      body: body.body,
    })
    .into('comments')
    .returning('*');
};

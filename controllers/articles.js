const {
  getArticles,
  getArticlesById,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
  addComment,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendArticlesById = (req, res, next) => {
  getArticlesById(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.updateArticlesById = (req, res, next) => {
  updateArticle(req)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.deleteArticlesByID = (req, res, next) => {
  deleteArticle(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
exports.sendCommentsByArticle = (req, res, next) => {
  getCommentsByArticle(req)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.addCommentToArticle = (req, res, next) => {
  addComment(req)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const {
  getArticles,
  getArticlesById,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
  addComment,
} = require('../models/articles');
const { getUsers } = require('../models/users');

exports.sendArticles = (req, res, next) => {
  // const username = req.query.author;
  // Promise.all([getArticles(req.query), getUsers({ username })])
  //   .then(([articles, users]) => {
  //     console.log(users);
  //     if (!users.length) {
  //       return Promise.reject({ status: 404, msg: 'Author Not Found' });
  //     } else res.status(200).send({ articles });
  //   })
  //   .catch(next);
  getArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendArticlesById = (req, res, next) => {
  getArticlesById(req.params)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      } else res.status(200).send({ article });
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
    .then((numOfDeletions) => {
      if (!numOfDeletions) {
        return Promise.reject({ status: 404, msg: 'ID Not Found' });
      } else res.sendStatus(204);
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

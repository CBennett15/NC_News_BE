const {
  getArticles,
  getArticlesById,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
  addComment,
  addArticle,
} = require('../models/articles');
const { getUsers } = require('../models/users');
const { getTopics } = require('../models/topics');

exports.sendArticles = (req, res, next) => {
  // getArticles(req.query)
  //   .then((articles) => {
  //     res.status(200).send({ articles });
  //   })
  //   .catch(next);
  const username = req.query.author;
  return Promise.all([
    getTopics(req.query),
    getUsers({ username }),
    getArticles(req.query),
  ])
    .then(([topics, users, articles]) => {
      if (!topics.length) {
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
      } else if (!users.length) {
        return Promise.reject({ status: 404, msg: 'Author Not Found' });
      } else res.status(200).send({ articles });
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
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      } else res.status(200).send({ comments });
    })
    .catch(next);
};
exports.addCommentToArticle = (req, res, next) => {
  if (!req.body.username || !req.body.body) {
    return Promise.reject({
      status: 400,
      msg: 'Not included all required keys',
    }).catch(next);
  }
  addComment(req)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.addNewArticle = (req, res, next) => {
  // if (!req.body.title || !req.body.body || !req.body.author) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: 'Not filled in all fields',
  //   }).catch(next);
  // }
  console.log(req.body);
  addArticle(req)
    .then(([article]) => {
      console.log(article);
      res.status(201).send({ article });
    })
    .catch(next);
};

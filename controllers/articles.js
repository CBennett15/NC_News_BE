const {
  getArticles,
  getArticlesById,
  updateArticle,
  deleteArticle,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query).then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.sendArticlesById = (req, res, next) => {
  getArticlesById(req.params).then(([article]) => {
    res.status(200).send({ article });
  });
};
exports.updateArticlesById = (req, res, next) => {
  updateArticle(req).then(([article]) => {
    res.status(201).send({ article });
  });
};
exports.deleteArticlesByID = (req, res, next) => {
  deleteArticle(req.params).then(() => {
    res.sendStatus(204);
  });
};

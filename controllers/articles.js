const {
  getArticles,
  getArticlesById,
  updateArticle,
} = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query).then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.sendArticlesById = (req, res, next) => {
  getArticlesById(req.params).then((articlebyID) => {
    res.status(200).send({ articlebyID });
  });
};
exports.updateArticlesById = (req, res, next) => {
  updateArticle(req.params).then((articlebyID) => {
    res.status(201).send({ articlebyID });
  });
};

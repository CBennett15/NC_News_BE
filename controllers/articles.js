const { getArticles, getArticlesById } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.sendArticlesById = (req, res, next) => {
  getArticlesById(req.params).then((article) => {
    res.status(200).send({ article });
  });
};

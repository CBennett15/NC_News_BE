const { getArticles } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

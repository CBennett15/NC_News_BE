const articlesRouter = require('express').Router();
const { sendArticles, sendArticlesById } = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter.route('/:articles_id').get(sendArticlesById);

module.exports = articlesRouter;

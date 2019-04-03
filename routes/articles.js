const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  updateArticlesById,
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:articles_id')
  .get(sendArticlesById)
  .patch(updateArticlesById);

module.exports = articlesRouter;

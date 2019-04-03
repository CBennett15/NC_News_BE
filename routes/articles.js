const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  updateArticlesById,
  deleteArticlesByID,
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:articles_id')
  .get(sendArticlesById)
  .patch(updateArticlesById)
  .delete(deleteArticlesByID);

module.exports = articlesRouter;

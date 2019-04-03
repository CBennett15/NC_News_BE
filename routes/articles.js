const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  updateArticlesById,
  deleteArticlesByID,
  sendCommentsByArticle,
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:articles_id')
  .get(sendArticlesById)
  .patch(updateArticlesById)
  .delete(deleteArticlesByID);

articlesRouter.route('/:articles_id/comments').get(sendCommentsByArticle);

module.exports = articlesRouter;

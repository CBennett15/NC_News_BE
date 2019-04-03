const commentsRouter = require('express').Router();
const {
  updateCommentsById,
  deleteCommentsById,
} = require('../controllers/comments');

commentsRouter
  .route('/:comments_id')
  .patch(updateCommentsById)
  .delete(deleteCommentsById);

module.exports = commentsRouter;

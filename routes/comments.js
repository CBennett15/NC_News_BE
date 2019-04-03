const commentsRouter = require('express').Router();
const { updateCommentsById } = require('../controllers/comments');

commentsRouter.route('/:comments_id').patch(updateCommentsById);
// .delete(deleteArticlesByID);

module.exports = commentsRouter;

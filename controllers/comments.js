const { updateComment, deleteComment } = require('../models/comments');

exports.updateCommentsById = (req, res, next) => {
  updateComment(req).then(([comment]) => {
    res.status(201).send({ comment });
  });
};
exports.deleteCommentsById = (req, res, next) => {
  deleteComment(req.params).then(() => {
    res.sendStatus(204);
  });
};

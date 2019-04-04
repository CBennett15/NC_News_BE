const {
  getComments,
  updateComment,
  deleteComment,
} = require('../models/comments');

exports.sendComments = (req, res, next) => {
  getComments()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.updateCommentsById = (req, res, next) => {
  updateComment(req)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteCommentsById = (req, res, next) => {
  deleteComment(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

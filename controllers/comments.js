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
      if (!comment) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      } else res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteCommentsById = (req, res, next) => {
  deleteComment(req.params)
    .then((numOfDeletions) => {
      if (!numOfDeletions) {
        return Promise.reject({ status: 404, msg: 'ID Not Found' });
      }
      res.sendStatus(204);
    })
    .catch(next);
};

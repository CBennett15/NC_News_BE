const { updateComment } = require('../models/comments');

exports.updateCommentsById = (req, res, next) => {
  updateComment(req).then(([comment]) => {
    res.status(201).send({ comment });
  });
};

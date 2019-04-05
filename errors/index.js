exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.badRequest = (err, req, res, next) => {
  const badCode = ['42703', '22P02'];
  if (badCode.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle422 = (err, req, res, next) => {
  res.status(422).send({ msg: 'Unprocessable Entity - already exists' });
};

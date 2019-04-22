const express = require('express');
const apiRouter = require('./routes/api');
const {
  routeNotFound,
  handle500,
  badRequest,
  customErrors,
  handle422,
  methodNotAllowed,
} = require('./errors');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app
  .route('/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(badRequest);

app.use(customErrors);

app.use(handle422);

app.use(handle500);

module.exports = app;

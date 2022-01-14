const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyparser = require('body-parser')
const allowedCors = [
  'localhost:3000',
  'http://api.finalnewssg.students.nomoreparties.sbs',
  'http://www.finalnewssg.students.nomoreparties.sbs',
  'http://finalnewssg.students.nomoreparties.sbs'
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100 // you can make a maximum of 100 requests from one IP
});

const {
  login,
  createUser
} = require('./controllers/users');

const { usersRouter } = require('./routes/users');
const { articlesRouter } = require('./routes/articles');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { validateURL } = require('./middlewares/urlValidator');
const NotFoundError = require('./errors/not-found-err');
const NotAuthorizedError = require('./errors/not-authorized-err');

const app = express();
app.use(helmet());
app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
}
next()
})

mongoose.connect('mongodb://localhost:27017/finalprojectdb');
app.use(express.json());
app.use(bodyparser.json());
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
     email: Joi.string().email(),
      password: Joi.string().required().min(8)
  })
 }), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
     email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required()
  })
 }), createUser);

app.use('/',(req, res, next) => {
  if(!auth) {
    throw new NotAuthorizedError('User is unauthorized')
  }
  auth
  next();
}, usersRouter);

app.use('/',(req, res, next) => {
  if(!auth) {
    throw new NotAuthorizedError('User is unauthorized')
  }
  auth
  next();
}, articlesRouter);

app.use(errorLogger);

app.use((req, res) => {
  // Invalid request
  throw new NotFoundError('Requested resource not found');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
    next()
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

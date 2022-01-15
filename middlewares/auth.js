const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');
const { JWT_SECRET, NODE_ENV} = process.env;

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports.authorize = (req, res, next) => {
  const { authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWUyYTNiNTY3MjIxNTI4OTE1MjZiMmQiLCJpYXQiOjE2NDIyNzQxODEsImV4cCI6MTY0Mjg3ODk4MX0.N9QUcYp1S1AHEBVY5U0EAuh8jg-sAJ2ZCte6SZLzCAU' } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('User is unauthorized')
  }
  const token = extractBearerToken( authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

  } catch (err) {
    throw new NotAuthorizedError('User is unauthorized')
  }


   req.user = payload;


  next();
};

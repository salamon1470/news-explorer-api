const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');
const { JWT_SECRET, NODE_ENV} = process.env;

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports.authorize = (req, res, next) => {
  const { authorization } = req.headers;
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

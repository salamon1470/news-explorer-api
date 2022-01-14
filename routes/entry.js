
const entryRouter = require('express').Router();
const {
  login,
  createUser
} = require('../controllers/users');


entryRouter.post('/signin',celebrate({
  body: Joi.object().keys({
     email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required()
  })
 }), login);
entryRouter.post('/signup',celebrate({
  body: Joi.object().keys({
     email: Joi.string().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required()
  })
 }), createUser);

module.exports = {
 entryRouter,
};


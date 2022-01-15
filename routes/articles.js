const articlesRouter = require('express').Router();
const { getArticles, createArticle, delArticle} = require('../controllers/articles');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middlewares/urlValidator');
const { authorize } = require('../middlewares/auth');
  // if(!authorize) {
  //   throw new NotAuthorizedError('User is unauthorized')
  // }
articlesRouter.get('/articles', authorize, getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL)
  })
 }), authorize, createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex()
  })
 }), authorize, delArticle);

module.exports = {
  articlesRouter,
};

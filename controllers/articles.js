const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .orFail()
    .then((articles) => res.send({ data: articles }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Articles not found');
      }
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid article data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid article data');
      }
    })
    .catch(next);
};

module.exports.delArticle = (req, res, next) => {
  Card.findByIdAndRemove(req.params.articleId)
    .orFail()
    .then((article) => {
         res.send({ data: article })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid article data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid article data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Article not found');
      }
    })
    .catch(next);
};
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const NotAuthorizedError = require('../errors/not-authorized-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({owner: req.user._id})
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
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({
      data: {
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
        _id: article._id,
        __v: article.__v,
      },
    }))
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
  Article.findById(req.params.articleId)
    .orFail()
    .then((art) => {
      const isOwn = req.user._id === art.owner._id.toString();
      if (!isOwn) {
        throw new NotAuthorizedError('User not authorized');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .orFail()
        .then((article) => {
          res.send({
            data: {
              keyword: article.keyword,
              title: article.title,
              text: article.text,
              date: article.date,
              source: article.source,
              link: article.link,
              image: article.image,
              _id: article._id,
              __v: article.__v,
            },
          });
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
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Article not found');
      }
	throw new NotAuthorizedError('User not authorized');

    })

    .catch(next);
};

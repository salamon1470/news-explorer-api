const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^((ftp|http|https):\/\/)?(www\.)?([a-z\-0-9\._~:\/?%#\[\]@!$&'()*\+,;=]+)\.([A-z]{2,})([\/a-z]+)?(#)?/gi.test(  // eslint-disable-line
        v,
      ),
      message: 'invalid url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^((ftp|http|https):\/\/)?(www\.)?([a-z\-0-9\._~:\/?%#\[\]@!$&'()*\+,;=]+)\.([A-z]{2,})([\/a-z]+)?(#)?/gi.test(  // eslint-disable-line
        v,
      ),
      message: 'invalid url',
    },
  },
  owner: {
    type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    select: false
  },
});


module.exports = mongoose.model('article', articleSchema);
'use strict';

const { Router } = require('express');

const router = new Router();
const User = require('./../models/user');
const Post = require('./../models/post');
const Event = require('./../models/event');

router.get('/', (req, res, next) => {
  let postSide;
  let eventsSide;
  Post.find()
    .sort({ timestamp: 'descending' })
    .limit(2)
    .then(documents => {
      postSide = documents;
      return Event.find()
        .sort({ creationDate: 'descending' })
        .limit(3);
    })
    .then(something => {
      eventsSide = something;
      return User.find();
    })
    .then(data => {
      res.render('user', { data, eventsSide, postSide });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;

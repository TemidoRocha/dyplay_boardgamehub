'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Event = require('./../models/event');

router.get('/', (req, res, next) => {
  let posts;
  Post.find()
    .sort({ timestamp: 'descending' })
    .limit(2)
    .then(documents => {
      posts = documents;
      return Event.find();
    })
    .then(events => {
      res.render('index', { events, posts });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;

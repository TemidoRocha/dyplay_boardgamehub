'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Event = require('./../models/event');

router.get('/', (req, res, next) => {
  let posts;
  let events;
  let eventsSide;
  Post.find()
    .sort({ timestamp: 'descending' })
    .limit(2)
    .then(documents => {
      posts = documents;
      return Event.find();
    })
    .then(document => {
      events = document;
    })
    .then(() => {
      return Event.find()
        .sort({ timestamp: 'descending' })
        .limit(3);
    })
    .then(document => {
      eventsSide = document;
      res.render('index', { posts, events, eventsSide });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;

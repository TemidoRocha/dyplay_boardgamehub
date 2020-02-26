'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Event = require('./../models/event');

router.get('/', (req, res, next) => {
  let postSide;
  let events;
  let eventsSide;
  Post.find()
    .sort({ timestamp: 'descending' })
    .limit(2)
    .then(documents => {
      postSide = documents;
      return Event.find();
    })
    .then(document => {
      events = document;
    })
    .then(() => {
      return Event.find()
        .sort({ creationDate: 'descending' })
        .limit(3);
    })
    .then(document => {
      eventsSide = document;
      res.render('index', { postSide, events, eventsSide });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/private', routeGuard, (req, res, next) => {
  console.log(req.user.location)
  res.render('private');
});

module.exports = router;

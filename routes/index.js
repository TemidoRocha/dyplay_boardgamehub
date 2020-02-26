'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const Event = require('./../models/event');

router.get('/', (req, res, next) => Event.find().then(events => res.render('index', { events })));

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;

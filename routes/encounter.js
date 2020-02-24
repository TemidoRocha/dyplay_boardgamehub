'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('encounter', { title: 'Hello Manuel!' });
});

router.get('/create', (req, res, next) => {
  res.render('create', { title: 'Hello Manuel!' });
});



module.exports = router;

'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('encounter', { title: 'Hello Manuel!' });
});

router.get('/create', (req, res, next) => {
  res.render('encounter/create', { title: 'Hello Manuel!' });
});

router.get('/single', (req, res, next) => {
  res.render('encounter/single');
});

router.get('/single/edit', (req, res, next) => {
  res.render('encounter/edit');
});

module.exports = router;

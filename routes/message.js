'use strict';

const { Router } = require('express');

const router = new Router();
const User = require('./../models/user');

router.get('/', (req, res, next) => {
  let id = req.user.id;
  User.findById(id).then(data => {
    res.render('message', { data });
  });
});

router.get('/:id', (req, res, next) => {
  let { id } = req.params;
  User.findById(id).then(data => {
    res.render('message', { data });
  });
});

module.exports = router;

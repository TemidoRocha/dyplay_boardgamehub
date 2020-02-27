'use strict';

const { Router } = require('express');

const router = new Router();
const User = require('./../models/user');

router.get('/', (req, res, next) => {
  const id = req.user.id;
  User.findById(id)
    .then(data => {
      res.render('message', { data });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(data => {
      res.render('message', { data });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;

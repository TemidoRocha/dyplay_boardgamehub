'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const Event = require('./../models/event');

//get methods

router.get('/', (req, res, next) => {
  Event.find()
    .then(encounters => res.render('encounter', { encounters }))
    .catch(error => next(error));
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

//post methods
router.post('/create', (req, res, next) => {
  const { eventName, latitude, longitude, date, numberOfPlayer, gameList } = req.body;
  Event.create({
    eventName,
    location: {
      coordinates: [longitude, latitude]
    },
    date,
    numberOfPlayer,
    gameList
  })
    .then(encounter => res.redirect('encounter/single', encounter))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

module.exports = router;

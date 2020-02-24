'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const Event = require('./../models/event');
const gameList = require('./../variables');

//get methods

router.get('/', (req, res, next) => {
  Event.find()
    .then(encounters => {
      res.render('encounter/index', { encounters });
    })
    .catch(error => next(error));
});

router.get('/create', (req, res, next) => {
  res.render('encounter/create', { gameList });
});

router.get('/single/:id', (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then(singleEvent => res.render('encounter/single', singleEvent))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

router.get('/single/:id/edit', (req, res, next) => {
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

//delete event
router.post('/single/:id/delete', (req, res, next) => {
  console.log(req.params.id);
  Event.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//insert the comment on the event. the id come on the query
router.post('/single/addComment', (req, res, next) => {
  const { player, comment } = req.body;
  Event.findByIdAndUpdate(
    {
      _id: req.query.event_id
    },
    {
      $push: { comments: { player, comment } }
    }
  )
    .then(encounter =>
      Event.findById(encounter._id).then(encounter => {
        res.render('encounter/single', encounter);
      })
    )
    .catch(error => {
      console.log(error);
      next(error);
    });
});

module.exports = router;

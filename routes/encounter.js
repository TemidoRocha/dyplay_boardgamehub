'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

const Event = require('./../models/event');
const gameList = require('./../variables');

//get methods
//encounter index
router.get('/', (req, res, next) => {
  Event.find()
    .populate('host waitingList')
    .then(encounters => {
      // console.log(encounters);
      res.render('encounter/index', { encounters });
    })
    .catch(error => next(error));
});

//create event
router.get('/create', routeGuard, (req, res, next) => {
  res.render('encounter/create', { gameList });
});

//show single event
router.get('/single/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .populate('host waitingList')
    .then(singleEvent => {
      singleEvent.players = singleEvent.waitingList.splice(singleEvent.numberOfPlayer);
      console.log(singleEvent);
      res.render('encounter/single', singleEvent);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//edit single event
router.get('/single/:id/edit', routeGuard, (req, res, next) => {
  Event.findById(req.params.id)
    .populate('host')
    .then(singleEvent => {
      singleEvent.total = gameList; //in order to pass the total value of the list
      res.render('encounter/edit', singleEvent);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//join the event
router.get('/single/:id/join', routeGuard, (req, res, next) => {
  Event.findByIdAndUpdate(
    {
      _id: req.params.id
    },
    {
      $push: { waitingList: req.user._id }
    }
  )
    .then(encounter => res.redirect('/encounter'))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//post methods
//create event
router.post('/create', routeGuard, (req, res, next) => {
  const { eventName, latitude, longitude, date, numberOfPlayer, gameList } = req.body;
  Event.create({
    eventName,
    host: req.user._id,
    location: {
      coordinates: [longitude, latitude]
    },
    date,
    numberOfPlayer,
    gameList,
    waitingList: [req.user._id]
  })
    .then(() => res.redirect('/encounter'))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//delete event
router.post('/single/:id/delete', routeGuard, (req, res, next) => {
  Event.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/encounter'))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//edit event
router.post('/single/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { eventName, latitude, longitude, date, numberOfPlayer, gameList } = req.body;
  Event.findByIdAndUpdate(
    id,
    { eventName, latitude, longitude, date, numberOfPlayer, gameList },
    { runValidators: true }
  )
    .then(event => {
      Event.findById(event._id)
        .populate('host')
        .then(event => res.render('encounter/single', event));
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//insert the comment on the event. the id come on the query
router.post('/single/addComment', routeGuard, (req, res, next) => {
  const player = req.user.name;
  const { comment } = req.body;
  Event.findByIdAndUpdate(
    {
      _id: req.query.event_id
    },
    {
      $push: { comments: { player, comment } }
    },
    { new: true }
  )
    .populate(waitingList)
    .then(encounter => res.render('encounter/single', encounter))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

//delete the comment on the event, it is coming back
router.post('/single/:id/deleteComment', routeGuard, (req, res, next) => {
  Event.update({}, { $pull: { comments: { _id: req.params.id } } }, { multi: true })
    .then(() => res.redirect('/encounter'))
    .catch(error => {
      console.log(error);
      next(error);
    });
});

module.exports = router;

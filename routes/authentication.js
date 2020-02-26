'use strict';

const { Router } = require('express');
const router = new Router();
const uploader = require('./../multer-configure.js');
const gameList = require('./../variables');

const passport = require('passport');

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
	console.log(user)
});

router.post(
  '/sign-in',
  passport.authenticate('sign-in', {
    successRedirect: '/',
    failureRedirect: 'sign-in'
	})
);

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up', { gameList });
});

router.post(
  '/sign-up',
  uploader.single('picture'),
  passport.authenticate('sign-up', {
    successRedirect: '/',
    failureRedirect: 'sign-up'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

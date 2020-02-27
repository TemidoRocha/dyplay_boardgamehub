'use strict';

const { Router } = require('express');
const router = new Router();
const uploader = require('./../multer-configure.js');
const gameList = require('./../variables');
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');

//for the nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

const passport = require('passport');

router.get('/sign-in', (req, res, next) => {
	res.render('sign-in');
});

router.post(
	'/sign-in',
	passport.authenticate('sign-in', {
		successRedirect: '/',
		failureRedirect: 'sign-in'
	})
);

router.get('/edit', routeGuard, (req, res, next) => {
	console.log(req.user);
	res.render('edit', { gameList });
});

router.post('/edit',
  uploader.single('picture'),
	passport.authenticate('edit', {
		successRedirect: '/',
		failureRedirect: 'edit'
	})
);


router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
	'/google-callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/');
	}
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

router.post('/deleteAccount', routeGuard, (req, res, next) => {
	transporter
		.sendMail({
			from: `DyPlay BoarGameHub <${process.env.EMAIL}>`,
			to: req.user.email,
			subject: 'DyPlay says Goodbye',
			// text: 'Hello world!'
			html: 'DyPlays says farewell! We hope this is not a goodbye!'
		})
		.then(result => {
			console.log(result);
		})
		.catch(error => {
			console.log(error);
		});
	User.deleteOne({ _id: req.user._id }).then(() => res.redirect('/'));
});

module.exports = router;

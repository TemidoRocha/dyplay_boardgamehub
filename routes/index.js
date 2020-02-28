'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Event = require('./../models/event');
const gameList = require('./../variables');
const User = require('./../models/user');
const uploader = require('./../multer-configure.js');
const passport = require('passport');

router.get('/', (req, res, next) => {
	let postSide;
	let events;
	let eventsSide;

	Post.find()
		.sort({ timestamp: 'descending' })
		.limit(4)
		.then(documents => {
			postSide = documents;
			return Event.find();
		})
		.then(document => {
			events = document;
		})
		.then(() => {
			return Event.find()
				.sort({ creationDate: 'descending' })
				.limit(5);
		})
		.then(document => {
			eventsSide = document;
			res.render('index', { postSide, events, eventsSide });
		})
		.catch(error => {
			next(error);
		});
});

router.get('/profile/:id', routeGuard, (req, res, next) => {
	let postSide;
	let eventsSide;
	let userdata;

	User.findById(req.params.id)
		.then(theUser => {
			userdata = theUser;
			return Post.find()
				.sort({ timestamp: 'descending' })
				.limit(2);
		})
		.then(posts => {
			postSide = posts;
			return Event.find()
				.sort({ creationDate: 'descending' })
				.limit(3);
		})
		.then(event => {
			eventsSide = event;
			res.render('userPublic', { userdata, eventsSide, postSide });
		})
		.catch(error => {
			console.log(error);
			next(error);
		});

	// res.render('userPublic', data);
});

router.get('/edit', routeGuard, (req, res, next) => {
	let postSide;
	let eventsSide;
	Post.find()
		.sort({ timestamp: 'descending' })
		.limit(2)
		.then(documents => {
			postSide = documents;
			return Event.find()
				.sort({ creationDate: 'descending' })
				.limit(3);
		})
		.then(something => {
			eventsSide = something;
			res.render('edit', { gameList, eventsSide, postSide });
		});
});

router.post('/edit', routeGuard, (req, res, next) => {
	const userId = req.user._id;
	const { username, bio } = req.body;
	if (req.file == null || undefined) {
		User.findByIdAndUpdate(userId, {
			username,
			bio
		})
			.then(() => {
				res.redirect('/');
			})
			.catch(error => {
				next(error);
			});
	} else {
		const { url } = req.file;
		User.findByIdAndUpdate(userId, {
			username,
			bio,
			picture: url
		})
			.then(() => {
				res.redirect('/');
			})
			.catch(error => {
				next(error);
			});
	}
});
module.exports = router;

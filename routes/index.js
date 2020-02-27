'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Event = require('./../models/event');
const gameList = require('./../variables');
const User = require('./../models/user');

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
	const { id } = req.params;
	res.render('userPublic');
});

router.get('/edit', routeGuard, (req, res, next) => {
	console.log(req.user);
	res.render('edit', { gameList });
});

module.exports = router;

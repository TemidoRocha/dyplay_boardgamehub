'use strict';

const { Router } = require('express');

const router = new Router();
const User = require('./../models/user');

router.get('/', (req, res) => {
	User.find().then(data => {
		res.render('user', { data });
	});
});

module.exports = router;

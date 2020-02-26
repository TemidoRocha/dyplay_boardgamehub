'use strict';

module.exports = (req, res, next) => {
	res.locals.process = process;
	res.locals.user = req.user;
	next();
};
git 
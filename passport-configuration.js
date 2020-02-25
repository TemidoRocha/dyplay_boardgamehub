'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const bcryptjs = require('bcryptjs');

passport.serializeUser((user, callback) => {
	callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
	User.findById(id)
		.then(user => {
			callback(null, user);
		})
		.catch(error => {
			callback(error);
		});
});

const uploader = require('./multer-configure.js');

passport.use(
	'sign-up',
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true
		},
		(req, a, b, callback) => {
			const { name, password, email, lat, lng, games, picture } = req.body;
			const location = { coordinates: [lat, lng] };
			console.log(req.body.lat);

			bcryptjs
				.hash(password, 10)
				.then(hash => {
					return User.create({
						name,
						email,
						picture,
						location,
						games,
						passwordHash: hash
					});
				})
				.then(user => {
					callback(null, user);
				})
				.catch(error => {
					console.log(error);
					callback(error);
				});
		}
	)
);

passport.use(
	'sign-in',
	new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
		let user;
		User.findOne({
			email
		})
			.then(document => {
				user = document;
				return bcryptjs.compare(password, user.passwordHash);
			})
			.then(passwordMatchesHash => {
				if (passwordMatchesHash) {
					callback(null, user);
				} else {
					callback(new Error('WRONG_PASSWORD'));
				}
			})
			.catch(error => {
				callback(error);
			});
	})
);

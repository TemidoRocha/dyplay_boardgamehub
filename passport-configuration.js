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
const gameList = require('./variables.js');

passport.use(
	'sign-up',
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true
		},
		(req, a, b, callback) => {
			const { name, password, email, lat, lng } = req.body;
			let games = [];

			for (let selectedGame in req.body) {
				const index = gameList.indexOf(selectedGame);

				index >= 0 ? games.push(selectedGame) : '';
			}

			const location = { coordinates: [lat, lng] };
			let picture;
			req.file.url ? (picture = req.file.url) : (picture = null);

			//console.log(req.file);
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

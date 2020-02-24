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

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_API_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	resource_type: 'raw'
});

const storage = multerStorageCloudinary({
	cloudinary,
	folder: 'jan20',
	resource_type: 'raw',
	allowedFormats: ['jpg', 'png', 'mov', 'mp4']
});

const uploader = multer({ storage });
passport.use(
	'sign-up',
	new LocalStrategy(
		{
			usernameField: 'email',
			passReqToCallback: true
		},
		(req, a, b, callback) => {
			const { name, password, email, location } = req.body;
			bcryptjs
				.hash(password, 10)
				.then(hash => {
					return User.create({
						name,
						email,
						location,
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
	'local-sign-in',
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

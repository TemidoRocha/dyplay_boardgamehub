'use strict';

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, callback) => {
      User.findOne({
        googleId: profile.id
      })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: `${profile.displayName}@dyplay.com`,
              location: { coordinates: [0, 0] },
              picture: profile.photos[0].value
            });
          }
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

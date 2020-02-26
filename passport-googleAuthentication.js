'use strict';

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/authentication/google-callback'
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log(profile);
      User.findOne({
        googleId: profile.id
      })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              googleId: profile.id,
              name: profile.displayName
              //profilePic: profile.photos[0].value
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

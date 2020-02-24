'use strict';

const mongoose = require('mongoose');

const Commentschema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  comment: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comments', Commentschema);

'use strict';

const mongoose = require('mongoose');

const Postschema = new mongoose.Schema({
  title: {
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
  description: {
    type: String
  },
  picture: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', Postschema);

'use strict';

const mongoose = require('mongoose');

const Postschema = new mongoose.Schema({
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
  desciption: {
    type: String
  },
  picture: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', Postschema);

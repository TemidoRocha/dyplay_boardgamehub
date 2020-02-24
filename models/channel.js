'use strict';

const mongoose = require('mongoose');

const Channelschema = new mongoose.Schema({
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
  desciption: {
    type: String
  },
  picture: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Channel', Channelschema);

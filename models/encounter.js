//NOT IN USE


'use strict';

const mongoose = require('mongoose');
const gameList = require('./../variables');

const schema = new mongoose.Schema(
  {
    gameName: {
      type: String
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);
// id: Object ID
// Creator : Player ID
// name : string
// Picture
// Description
// timestamp
module.exports = mongoose.model('Event', schema);

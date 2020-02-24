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
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [
        {
          type: Number,
          min: -180,
          max: 180
        }
      ]
    },
    hour: String,
    date: {
      type: Date,
      min: new Date()
    },
    numberOfPlayer: {
      type: Number,
      required: true,
      min: 1
    },
    waitingList: {
      type: String
    },
    gameList: {
      type: String,
      enum: gameList
    },
    comments: [
      {
        player: String,
        comment: String
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

module.exports = mongoose.model('Event', schema);

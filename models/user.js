'use strict';

const mongoose = require('mongoose');
const gameList = require('./../variables');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			index: true
		},
		googleId: String,
		email: {
			type: String,
			required: [true, "can't be blank"],
			lowercase: true,
			trim: true,
			unique: true
		},
		passwordHash: {
			type: String
		},
		role: {
			type: String,
			enum: ['admin', 'player', 'guest']
		},
		location: {
			type: {
				type: String,
				default: 'Point',
				required: [true, "can't be blank"]
			},
			coordinates: [
				{
					type: Number,
					min: -180,
					max: 180
				}
			]
		},
		picture: [
			{
				type: String,
				required: [true, "you need a photo"]
			}
		],
		games: [
			{
				type: String,
				enum: gameList,
				required: true
			}
		],
		description: String
	},
	{
		timestamps: {
			createdAt: 'creationDate',
			updatedAt: 'updateDate'
		}
	}
);

module.exports = mongoose.model('User', schema);

'use strict';

const mongoose = require('mongoose');
const gameList = require('./../variables');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
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
		picture: [
			{
				type: String
			}
		],
		games: [
			{
				type: String,
				enum: gameList
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

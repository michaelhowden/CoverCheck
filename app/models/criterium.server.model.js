'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Criterium Schema
 */
var CriteriumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Criterium name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Criterium', CriteriumSchema);
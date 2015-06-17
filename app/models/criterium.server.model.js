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
	criteria: {
		type: String,
		default: '',
		required: 'Please fill criteria',
		trim: true
	},
	required_criteria: {
		type: Boolean,
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

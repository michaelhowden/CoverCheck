'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Metric Schema
 */
var MetricSchema = new Schema({
	covered: {
		type: Boolean,
	},
	// @ToDo: Change to use GeoJSON
	loc: {
	  lng: Number,
	  lat: Number
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

mongoose.model('Metric', MetricSchema);

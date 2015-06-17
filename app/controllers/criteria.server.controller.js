'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Criterium = mongoose.model('Criterium'),
	_ = require('lodash');

/**
 * Create a Criterium
 */
exports.create = function(req, res) {
	var criterium = new Criterium(req.body);
	criterium.user = req.user;

	criterium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(criterium);
		}
	});
};

/**
 * Show the current Criterium
 */
exports.read = function(req, res) {
	res.jsonp(req.criterium);
};

/**
 * Update a Criterium
 */
exports.update = function(req, res) {
	var criterium = req.criterium ;

	criterium = _.extend(criterium , req.body);

	criterium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(criterium);
		}
	});
};

/**
 * Delete an Criterium
 */
exports.delete = function(req, res) {
	var criterium = req.criterium ;

	criterium.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(criterium);
		}
	});
};

/**
 * List of Criteria
 */
exports.list = function(req, res) {
	Criterium.find().sort('created').populate('user', 'displayName').exec(function(err, criteria) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(criteria);
		}
	});
};

/**
 * Criterium middleware
 */
exports.criteriumByID = function(req, res, next, id) {
	Criterium.findById(id).populate('user', 'displayName').exec(function(err, criterium) {
		if (err) return next(err);
		if (! criterium) return next(new Error('Failed to load Criterium ' + id));
		req.criterium = criterium ;
		next();
	});
};

/**
 * Criterium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.criterium.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

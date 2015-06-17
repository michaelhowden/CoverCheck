'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Criterium = mongoose.model('Criterium');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.check = function(req, res) {
	Criterium.find({required_criteria: true}).sort('_id').select('id').exec(function(err, requiredCriteriumIds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			var trueCriteriumIds = req.body.trueCriteriumIds;

			trueCriteriumIds.sort();

			// Check if the requiredCriteriumIds match the trueCriteriumIds
			var check = true;
			if (trueCriteriumIds.length !== requiredCriteriumIds.length) {
				check = false;
			}
			else {
				for (var i=0; i<trueCriteriumIds.length; i++) {
					if (trueCriteriumIds[i] !== String(requiredCriteriumIds[i]._id)) {
						check = false;
						break;
					}
				}
			}

			return res.status(200).send({
				check: check
			});
		}
	});
};

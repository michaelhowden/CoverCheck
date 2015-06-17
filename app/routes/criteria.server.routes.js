'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var criteria = require('../../app/controllers/criteria.server.controller');

	// Criteria Routes
	app.route('/criteria')
		.get(criteria.list)
		.post(users.requiresLogin, criteria.create);

	app.route('/criteria/:criteriumId')
		.get(criteria.read)
		.put(users.requiresLogin, criteria.hasAuthorization, criteria.update)
		.delete(users.requiresLogin, criteria.hasAuthorization, criteria.delete);

	// Finish by binding the Criterium middleware
	app.param('criteriumId', criteria.criteriumByID);
};

'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Criterium = mongoose.model('Criterium'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, criterium;

/**
 * Criterium routes tests
 */
describe('Criterium CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Criterium
		user.save(function() {
			criterium = {
				name: 'Criterium Name'
			};

			done();
		});
	});

	it('should be able to save Criterium instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Criterium
				agent.post('/criteria')
					.send(criterium)
					.expect(200)
					.end(function(criteriumSaveErr, criteriumSaveRes) {
						// Handle Criterium save error
						if (criteriumSaveErr) done(criteriumSaveErr);

						// Get a list of Criteria
						agent.get('/criteria')
							.end(function(criteriaGetErr, criteriaGetRes) {
								// Handle Criterium save error
								if (criteriaGetErr) done(criteriaGetErr);

								// Get Criteria list
								var criteria = criteriaGetRes.body;

								// Set assertions
								(criteria[0].user._id).should.equal(userId);
								(criteria[0].name).should.match('Criterium Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Criterium instance if not logged in', function(done) {
		agent.post('/criteria')
			.send(criterium)
			.expect(401)
			.end(function(criteriumSaveErr, criteriumSaveRes) {
				// Call the assertion callback
				done(criteriumSaveErr);
			});
	});

	it('should not be able to save Criterium instance if no name is provided', function(done) {
		// Invalidate name field
		criterium.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Criterium
				agent.post('/criteria')
					.send(criterium)
					.expect(400)
					.end(function(criteriumSaveErr, criteriumSaveRes) {
						// Set message assertion
						(criteriumSaveRes.body.message).should.match('Please fill Criterium name');
						
						// Handle Criterium save error
						done(criteriumSaveErr);
					});
			});
	});

	it('should be able to update Criterium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Criterium
				agent.post('/criteria')
					.send(criterium)
					.expect(200)
					.end(function(criteriumSaveErr, criteriumSaveRes) {
						// Handle Criterium save error
						if (criteriumSaveErr) done(criteriumSaveErr);

						// Update Criterium name
						criterium.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Criterium
						agent.put('/criteria/' + criteriumSaveRes.body._id)
							.send(criterium)
							.expect(200)
							.end(function(criteriumUpdateErr, criteriumUpdateRes) {
								// Handle Criterium update error
								if (criteriumUpdateErr) done(criteriumUpdateErr);

								// Set assertions
								(criteriumUpdateRes.body._id).should.equal(criteriumSaveRes.body._id);
								(criteriumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Criteria if not signed in', function(done) {
		// Create new Criterium model instance
		var criteriumObj = new Criterium(criterium);

		// Save the Criterium
		criteriumObj.save(function() {
			// Request Criteria
			request(app).get('/criteria')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Criterium if not signed in', function(done) {
		// Create new Criterium model instance
		var criteriumObj = new Criterium(criterium);

		// Save the Criterium
		criteriumObj.save(function() {
			request(app).get('/criteria/' + criteriumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', criterium.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Criterium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Criterium
				agent.post('/criteria')
					.send(criterium)
					.expect(200)
					.end(function(criteriumSaveErr, criteriumSaveRes) {
						// Handle Criterium save error
						if (criteriumSaveErr) done(criteriumSaveErr);

						// Delete existing Criterium
						agent.delete('/criteria/' + criteriumSaveRes.body._id)
							.send(criterium)
							.expect(200)
							.end(function(criteriumDeleteErr, criteriumDeleteRes) {
								// Handle Criterium error error
								if (criteriumDeleteErr) done(criteriumDeleteErr);

								// Set assertions
								(criteriumDeleteRes.body._id).should.equal(criteriumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Criterium instance if not signed in', function(done) {
		// Set Criterium user 
		criterium.user = user;

		// Create new Criterium model instance
		var criteriumObj = new Criterium(criterium);

		// Save the Criterium
		criteriumObj.save(function() {
			// Try deleting Criterium
			request(app).delete('/criteria/' + criteriumObj._id)
			.expect(401)
			.end(function(criteriumDeleteErr, criteriumDeleteRes) {
				// Set message assertion
				(criteriumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Criterium error error
				done(criteriumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Criterium.remove().exec();
		done();
	});
});
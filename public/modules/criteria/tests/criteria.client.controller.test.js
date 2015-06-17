'use strict';

(function() {
	// Criteria Controller Spec
	describe('Criteria Controller Tests', function() {
		// Initialize global variables
		var CriteriaController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Criteria controller.
			CriteriaController = $controller('CriteriaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Criterium object fetched from XHR', inject(function(Criteria) {
			// Create sample Criterium using the Criteria service
			var sampleCriterium = new Criteria({
				name: 'New Criterium'
			});

			// Create a sample Criteria array that includes the new Criterium
			var sampleCriteria = [sampleCriterium];

			// Set GET response
			$httpBackend.expectGET('criteria').respond(sampleCriteria);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.criteria).toEqualData(sampleCriteria);
		}));

		it('$scope.findOne() should create an array with one Criterium object fetched from XHR using a criteriumId URL parameter', inject(function(Criteria) {
			// Define a sample Criterium object
			var sampleCriterium = new Criteria({
				name: 'New Criterium'
			});

			// Set the URL parameter
			$stateParams.criteriumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/criteria\/([0-9a-fA-F]{24})$/).respond(sampleCriterium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.criterium).toEqualData(sampleCriterium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Criteria) {
			// Create a sample Criterium object
			var sampleCriteriumPostData = new Criteria({
				name: 'New Criterium'
			});

			// Create a sample Criterium response
			var sampleCriteriumResponse = new Criteria({
				_id: '525cf20451979dea2c000001',
				name: 'New Criterium'
			});

			// Fixture mock form input values
			scope.name = 'New Criterium';

			// Set POST response
			$httpBackend.expectPOST('criteria', sampleCriteriumPostData).respond(sampleCriteriumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Criterium was created
			expect($location.path()).toBe('/criteria/' + sampleCriteriumResponse._id);
		}));

		it('$scope.update() should update a valid Criterium', inject(function(Criteria) {
			// Define a sample Criterium put data
			var sampleCriteriumPutData = new Criteria({
				_id: '525cf20451979dea2c000001',
				name: 'New Criterium'
			});

			// Mock Criterium in scope
			scope.criterium = sampleCriteriumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/criteria\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/criteria/' + sampleCriteriumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid criteriumId and remove the Criterium from the scope', inject(function(Criteria) {
			// Create new Criterium object
			var sampleCriterium = new Criteria({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Criteria array and include the Criterium
			scope.criteria = [sampleCriterium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/criteria\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCriterium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.criteria.length).toBe(0);
		}));
	});
}());
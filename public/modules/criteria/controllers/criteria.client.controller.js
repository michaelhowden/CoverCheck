'use strict';

// Criteria controller
angular.module('criteria').controller('CriteriaController', ['$scope', '$stateParams', '$location', 'Authentication', 'Criteria',
	function($scope, $stateParams, $location, Authentication, Criteria) {
		$scope.authentication = Authentication;

		// Create new Criterium
		$scope.create = function() {
			// Create new Criterium object
			var criterium = new Criteria ({
				name: this.name
			});

			// Redirect after save
			criterium.$save(function(response) {
				$location.path('criteria/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Criterium
		$scope.remove = function(criterium) {
			if ( criterium ) { 
				criterium.$remove();

				for (var i in $scope.criteria) {
					if ($scope.criteria [i] === criterium) {
						$scope.criteria.splice(i, 1);
					}
				}
			} else {
				$scope.criterium.$remove(function() {
					$location.path('criteria');
				});
			}
		};

		// Update existing Criterium
		$scope.update = function() {
			var criterium = $scope.criterium;

			criterium.$update(function() {
				$location.path('criteria/' + criterium._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Criteria
		$scope.find = function() {
			$scope.criteria = Criteria.query();
		};

		// Find existing Criterium
		$scope.findOne = function() {
			$scope.criterium = Criteria.get({ 
				criteriumId: $stateParams.criteriumId
			});
		};
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', 'Criteria',
	function($scope, $http, Authentication, Criteria) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.criteria = Criteria.query();

		// Check Criterium
		// @ToDo: Migrate this to a Service
		$scope.check = function() {
			// Construct array of criteria id to check
			var checkCriteria = $scope.criteria;
			var trueCriteriumIds = [];
			for (var i = 0; i < checkCriteria.length; i++) {
				var checkCriterium = checkCriteria[i];
				if (checkCriterium.check === true) {
					trueCriteriumIds.push(checkCriterium._id);
				}
			}

			// PUT criteria results to Server + Check them
			$http.put('/check', {trueCriteriumIds: trueCriteriumIds}).
			  success(function(data, status, headers, config) {
					// Display Result based on Server Check
					if (data.check) {
						$scope.template = 'yes';
					} else {
						$scope.template = 'no';
					}

			  });


		};
	}
]);

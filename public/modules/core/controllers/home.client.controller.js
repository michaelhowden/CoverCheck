'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', 'Criteria',  'uiGmapGoogleMapApi',
	function($scope, $http, Authentication, Criteria, uiGmapGoogleMapApi) {
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

			// uiGmapGoogleMapApi is a promise.
	    // The "then" callback function provides the google.maps object.
	    uiGmapGoogleMapApi.then(function(maps) {
				// Try W3C Geolocation (Preferred)
				var initialLocation;
				if(navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						initialLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
						$scope.map = { center: initialLocation, zoom: 12 };
					}, function() {
						initialLocation = { latitude: 174.777222, longitude: -41.288889 };
						$scope.map = { center: initialLocation, zoom: 12 };
					});
				} else {
					initialLocation = { latitude: 174.777222, longitude: -41.288889 };
					$scope.map = { center: initialLocation, zoom: 12 };
  			}

				// Find Places (health, doctor, hospital)
				var service = new google.maps.places.PlacesService(map);
			  service.nearbySearch(request, callback);

				// --------

				var request = {
			    location: pyrmont,
			    radius: 500,
			    types: ['store']
			  };
			  infowindow = new google.maps.InfoWindow();
			  var service = new google.maps.places.PlacesService(map);
			  service.nearbySearch(request, callback);
			}

			function callback(results, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
			    for (var i = 0; i < results.length; i++) {
			      createMarker(results[i]);
			    }
			  }
			}

			function createMarker(place) {
			  var placeLoc = place.geometry.location;
			  var marker = new google.maps.Marker({
			    map: map,
			    position: place.geometry.location
			  });

			  google.maps.event.addListener(marker, 'click', function() {
			    infowindow.setContent(place.name);
			    infowindow.open(map, this);
			  });
			}

			google.maps.event.addDomListener(window, 'load', initialize);

	    });
		};
	}
]);

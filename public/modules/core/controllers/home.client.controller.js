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

		/* Map Functions
		  Adapted from examples at:
			https://developers.google.com/maps/documentation/javascript/examples/place-search
			https://developers.google.com/maps/articles/geolocation
			*/

		var initialLocation;
		var map;
		var infowindow;
		var wellington = new google.maps.LatLng(-41.29, 174.78);

		$scope.initialize = function() {
			var browserSupportFlag;

			var myOptions = {
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

			// Try W3C Geolocation (Preferred)
			if(navigator.geolocation) {
				browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					map.setCenter(initialLocation);
					placeSearch(initialLocation);
				}, function() {
					handleNoGeolocation(browserSupportFlag);
				}, {timeout:5000});
			}
			// Browser doesn't support Geolocation
			else {
				browserSupportFlag = false;
				handleNoGeolocation(browserSupportFlag);
			}
		};

		function handleNoGeolocation(errorFlag) {
			if (errorFlag === true) {
				alert('Geolocation service failed.');
				initialLocation = wellington;
			} else {
				alert('Your browser does not support geolocation.');
				initialLocation = wellington;
			}
			map.setCenter(initialLocation);
			placeSearch(initialLocation);
		}

		function placeSearch(initialLocation) {
			var request = {
				location: initialLocation,
				radius: 10000,
				types: ['doctor', 'hospital']
			};
			infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);
		}

		function callback(results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
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
	}
]);

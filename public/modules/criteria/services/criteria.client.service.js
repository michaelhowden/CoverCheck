'use strict';

//Criteria service used to communicate Criteria REST endpoints
angular.module('criteria').factory('Criteria', ['$resource',
	function($resource) {
		return $resource('criteria/:criteriumId', { criteriumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('criteria').config(['$stateProvider',
	function($stateProvider) {
		// Criteria state routing
		$stateProvider.
		state('listCriteria', {
			url: '/criteria',
			templateUrl: 'modules/criteria/views/list-criteria.client.view.html'
		}).
		state('createCriterium', {
			url: '/criteria/create',
			templateUrl: 'modules/criteria/views/create-criterium.client.view.html'
		}).
		state('viewCriterium', {
			url: '/criteria/:criteriumId',
			templateUrl: 'modules/criteria/views/view-criterium.client.view.html'
		}).
		state('editCriterium', {
			url: '/criteria/:criteriumId/edit',
			templateUrl: 'modules/criteria/views/edit-criterium.client.view.html'
		});
	}
]);
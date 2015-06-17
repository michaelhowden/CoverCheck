'use strict';

// Setting up route
angular.module('core', ['uiGmapgoogle-maps']).config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAW2Cs4Zrjy2Uxw911XI7Xc79wG4YBW-tU',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

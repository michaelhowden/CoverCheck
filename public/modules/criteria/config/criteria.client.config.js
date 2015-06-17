'use strict';

// Configuring the Articles module
angular.module('criteria').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Criteria', 'criteria', 'dropdown', '/criteria(/create)?');
		Menus.addSubMenuItem('topbar', 'criteria', 'List Criteria', 'criteria');
		Menus.addSubMenuItem('topbar', 'criteria', 'New Criterium', 'criteria/create');
	}
]);
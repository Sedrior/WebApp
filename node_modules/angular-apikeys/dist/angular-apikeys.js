/*
 * angular-apikeys - Copyright (C) Ronny Haase, 2016.
 *
 * Licensed under The MIT License.
 *
 * https://github.com/ronnyhaase/angular-apikeys
 */
(function() {
	'use strict';

	angular.module('apikeys', []);
})();

(function() {
	'use strict';

	angular.module('apikeys').provider('apiKeys', function ApiKeysProvider() {
		var _apiKeys = Object.create(null);

		function set(id, value/*, options*/) {
			if (!angular.isString(id) || id === '' ||
					!angular.isString(value) || value === '') {
				return false;
			}

			_apiKeys[id] = value;

			return true;
		}

		function get(id) {
			if (!angular.isString(id) || id === '') {
				return false;
			}

			return _apiKeys[id];
		}

		function has(id) {
			if (!angular.isString(id) || id === '') {
				return false;
			}

			return !!_apiKeys[id];
		}

		this.get = get;
		this.set = set;
		this.has = has;

		this.$get = [function apiKeysFactoy() {
			return {
				get: get,
				set: set,
				has: has
			};
		}];
	});
})();

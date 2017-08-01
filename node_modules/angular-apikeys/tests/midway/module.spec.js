'use strict';

// Disable JSHint: "Expected an assignment or function call and instead saw an expression."
// Otherwise JSHint dislikes ChaiJS
/*jshint -W030 */

var expect = chai.expect;

describe('Midway: Modules', function() {
	describe('Module: apikeys', function () {
		var module;
		before(function() {
			module = angular.module('apikeys');
		});

		it('should be registered', function() {
			expect(module).not.to.equal(null);
		});
	});
});

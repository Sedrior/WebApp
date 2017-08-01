'use strict';

// Disable JSHint: "Expected an assignment or function call and instead saw an expression."
// Otherwise JSHint dislikes ChaiJS
/*jshint -W030 */

var expect = chai.expect;

describe('Unit: APIKeys', function() {
	// Some defaults for testing
	var invalidKeysAndValues = [
				'', // (!)
				true, 1, [1], {a:'a'}, /[a-z]/,

				false, 0, null, undefined, NaN
		],
		validKey = 'test',
		validValue = '1234567890';

	// API tests
	describe('API', function () {
		var service;

		beforeEach(function() {
			module('apikeys');
		});
		beforeEach(inject(function(apiKeys){
			service = apiKeys;
		}));

		describe('#set()', function () {
			it('should return true when calling with valid @key & @value', function () {
				expect(
					service.set(validKey, validValue)
				).to.be.true;
			});

			it('should return false if @key is not a filled string', function () {
				invalidKeysAndValues.forEach(function (key) {
					expect(
						service.set(key, validValue)
					).to.be.false;
				});
			});

			it('should return false if @value is not a filled string', function () {
				var n = 1;
				invalidKeysAndValues.forEach(function (value) {
					expect(
						service.set(validKey + n++, value)
					).to.be.false;
				});
			});
		});

		describe('#get()', function () {
			it('should return the value for a valid @key, if set with #set() before', function () {
				service.set(validKey, validValue);
				expect(
					service.get(validKey)
				).to.be.equal(validValue);
			});

			it('should return undefined for a valid @key, NOT set before', function () {
				expect(
					service.get(validKey)
				).to.be.undefined;
			});

			it('should return false for any invalid @key', function () {
				invalidKeysAndValues.forEach(function (key) {
					expect(
						service.get(key)
					).to.be.false;
				});
			});
		});

		describe('#has()', function () {
			it('should return true for a valid @key, if set with #set() before', function () {
				service.set(validKey, validValue);

				expect(
					service.has(validKey)
				).to.be.true;
			});

			it('should return false for a valid @key, not set before', function () {
				expect(
					service.has(validKey)
				).to.be.false;
			});

			it('should return false for a invalid @key', function () {
				invalidKeysAndValues.forEach(function (key) {
					expect(
						service.has(key)
					).to.be.false;
				});
			});
		});

		describe('(scenarios)', function () {
			it('#set() does really not store invalid keys', function () {
				invalidKeysAndValues.forEach(function (key) {
					expect(
						service.set(key, validValue)
					).to.be.false;

					expect(
						service.get(key)
					).to.not.equal(validValue);

					// A seperate test, otherwise the previous expect would
					// need ".not.to.be.false" appended which reads awful even
					// though logically correct
					expect(
						service.get(key)
					).to.be.false;
				});
			});
		});
	});

	// Test if provider works in configuration phase
	describe('Angular configuration phase', function () {
		var provider;

		beforeEach(function () {
			angular.module('test.apikeys', ['apikeys'])
				.config(function (apiKeysProvider) {
					provider = apiKeysProvider;
				});

			module('test.apikeys', 'apikeys');
			inject();
		});

		it('should be injected', function () {
			expect(provider).to.not.be.undefined;
		});

		it('should have it\'s methods #get(), #set() and #has()', function () {
			expect(provider.get).to.not.be.undefined;
			expect(provider.set).to.not.be.undefined;
			expect(provider.has).to.not.be.undefined;
		});

		it('should store a valid @key and @value with #set(), approve with #has() and return it with #get()', function () {
			expect(
				provider.set(validKey, validValue)
			).to.not.be.false;

			expect(
				provider.has(validKey)
			).to.be.true;

			expect(
				provider.get(validKey)
			).to.equal(validValue);
		});
	});

	// Test if provider and instance work hand in hand (config- and run-time)
	describe('Angular runtime', function () {
		var provider,
			instance;

		beforeEach(function () {
			angular.module('test.apikeys', ['apikeys'])
					.config(function (apiKeysProvider) {
						provider = apiKeysProvider;
					})
					.run(function (apiKeys) {
						instance = apiKeys;
					});

			module('test.apikeys', 'apikeys');
			inject();
		});

		it('should access values that were set in configuration phase via the provider, at runtime via the instance', function () {
			provider.set(validKey, validValue);

			expect(
				instance.has(validKey)
			).to.be.true;

			expect(
				instance.get(validKey)
			).to.equal(validValue);
		});
	});
});
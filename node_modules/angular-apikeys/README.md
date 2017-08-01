# angular-apikeys
A Angular module with a service for a more elegant sharing and storing of your API keys

Copyright (c) Ronny Haase, 2016.

Licensed under The MIT License.

https://github.com/ronnyhaase/angular-apikeys

## Introduction
If you ever run into the problem of talking to a lot of APIs in your AngularJS application and needed a place to manage the API keys, this tiny, unfancy module with just one lonesome service **(backed by unit tests)** is for you!

It's also used as optional dependency by other modules and services implementing APIs, as a kind of registry. *(More details [here](#using-angular-apikeys-as-registry))*

## Why
Because it

1. Decouples the problem of holding API keys
3. Can be used as a generic way of handling API keys across projects
2. Is more elegant than solving this with `angular.constant` or `angular.value` especially across multiple modules

## Installation

Use `npm`:

	$ npm install angular-apikeys

Or `Bower`:

	$ bower install angular-apikeys

Or grab the latest [release](https://github.com/ronnyhaase/angular-apikeys/releases) and add the JS file manually.

```html
<script src="angular-apikeys.js"></script>
```
Or minified:

```html
<script src="angular-apikeys.min.js"></script>
```

## HowTo

The module is *"apikeys"* and it only consists of the service *"apiKeys"*, which has the methods `get(id)`, `set(id, apikey)` and `has(id)`.

```javascript
angular.module('myApp', ['apikeys']);

angular.module('myApp').run(['apiKeys', function (apiKeys) {
	fetchMyApiKeysSomehow().then(function(keys) {
		apiKeys.set('google.maps.geocode', keys.google.geocode);
	});
}]);

angular.module('myApp').factory('googleGeocode', ['apiKeys', function (apiKeys) {
	// ...
	$http({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		params: {
			key: apiKey.has('google.maps.geocode')
				? apiKeys.get('google.maps.geocode')
				: '12345'
		}
		// ...
	});
	// ...
}]);
```

As I said: Its unfancy.

Both, key and value must be non-empty strings.

Angular-apikeys is unoptionated about how you name your keys, but the lower case dot notation, seems to make sense to me.

Also notice, that it's currently possible to overwrite existing keys with `set()`. But for now it didn't seem to make sense to add more logic around such problems.

That's it, the rest is up to you.

---

Also, since ApiKeys is a provider you can use it in the configuration phase of AngularJS, e.g. to do crazy things with $httpProvider:

```javascript
angular.module('myOtherApp').config('apiKeysProvider', [function (apiKeys) {
	// Same API
	apiKeys.set('googlePlaces', '0987654321');
	apiKeys.get('googlePlaces');
}]).run(function (apiKeys) {
	// Already available for a long time...
	apiKeys.get('googlePlaces');
});
```

---

Things like read-only, more strict key/value validation or other crazy ideas may be added later, if necessary.

## API Reference

### Module: apikeys

#### Dependencies: *none*

#### apiKeys
Service (provider) in module apikeys

##### Description
Stores and delivers API keys.

##### Methods

###### get(id)
Returns a API key by it's ID.

**Arguments**

| Param | Type     | Details                       |
|-------|----------|-------------------------------|
| id    | `String` | The ID of the key to fetch    |

**Returns**

`String | undefined | false` The key of the requested ID, or `undefined` if it's unknown, or `false` in case of an error.

---

###### has(id)
Returns if a API key ID is defined.

**Arguments**

| Param | Type     | Details                       |
|-------|----------|-------------------------------|
| id    | `String` | The ID of the key to look up  |

**Returns**

`Boolean` If the API key is defined

---

###### set(id, apikey)
Sets or resets a API key.

**Arguments**

| Param  | Type     | Details                  |
|--------|----------|--------------------------|
| id     | `String` | The ID of the key to set |
| apikey | `String` | The API key to store     |

**Returns**

`Boolean` If the API key was successfully stored

## Using angular-apikeys as registry

Let's see this with an example.

Imagine you and your team build an application around Google Maps APIs which provide quiet a lot APIs, and you split modules and services - what totally makes sense.

Likely you want to reuse your services for Google Maps APIs across projects.

By injecting angular-apikeys without declaring it explicitly as dependency, your services can provide a generic way to provide them with API keys, but neither your API modules & services nor other applications/modules usign them need to use angular-apikeys.

This is how it could look like:

[See on Plunker](http://plnkr.co/edit/eE98GLKgDFAqItji1bPR?p=preview)

````javascript
// (No "hard" dependency to apiKeys)
angular.module('google.maps', []);

angular.module('google.maps')
  .provider('geocoding', function () {
    var ID_APIKEY = 'google.maps.geocoding'; // A Unique ID for our API key

    var apiKey = null;

    // For folks not using angular-apikeys
    this.setApiKey = function (key) {
      if (angular.isString(key)) {
        apiKey = key;
      }

      return !!apiKey;
    };

    this.$get = ['$injector', function ($injector) {
      // Check via $injector.has, $injector.get throws if service is unknown!
      var apiKeys = $injector.has('apiKeys')
          ? $injector.get('apiKeys')
          : null;

      // Prefer apiKeys (you don't have to, of course)
      if (apiKeys && apiKeys.has(ID_APIKEY)) {
        apiKey = apiKeys.get(ID_APIKEY);
      }

      // Can't live without
      if (!apiKey) {
        throw 'You must provide a API key via apiKeys or manually with setApiKey() via the provider'
        return null;
      }

      console.log('google.maps.geocoding is all set up!');

      // ... Your super awesome service code ...

      return {
        // ...
        _apiKey: apiKey
      };
    }];
  })
  .provider('geolocation', function () {
    var ID_APIKEY = 'google.maps.geolocation';

    // All the same as geocoding-service
    // ...
    this.$get = {};
  });



angular.module('myApp', ['apikeys', 'google.maps']);

// Now we set the expected ID...
angular.module('myApp').config(['apiKeysProvider', function (apiKeys) {
  apiKeys.set('google.maps.geocoding', '1234567890');
  apiKeys.set('google.maps.geolocation', '1234567891');
  // ...
}]);


// ... and geocoding automagically has it's API key
angular.module('myApp').run(['geocoding', function (geocoding) {
  console.log(geocoding._apiKey === '1234567890'); // true
}]);
````

## Contributing
Please create an issue. If you add a pull request, try to respect my code style, check for JSHint and assure the unit tests do pass, and extend them if necessary!

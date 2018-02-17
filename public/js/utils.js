var app = app || {};

(function () {
	'use strict';

	app.Utils = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					.toString(16);
			}

			return uuid;
		},

		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		// Post to the API to store todos
		store: function (data) {
			fetch(BASE_PATH + 'api/todos', { method: 'POST',
				body: JSON.stringify(data)
			}).then(function(response) {
				return response.json();
			}).then(function(json) {
				console.log('saved');
			}).catch(function(err) {
				console.error(err);
			});
		},

		// Fetch todos from the API
		load: function(callback) {
			fetch(BASE_PATH + 'api/todos').then(function(response) {
				return response.json();
			}).then(function(json) {
				return callback(null, json);
			}).catch(function(err) {
				return callback(err);
			});
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();

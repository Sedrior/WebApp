module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*\n' +
				' * angular-apikeys - Copyright (C) Ronny Haase, 2016.\n' +
				' *\n' +
				' * Licensed under The MIT License.\n' +
				' *\n' +
				' * https://github.com/ronnyhaase/angular-apikeys\n' +
				' */\n'
		},

		concat: {
			dist: {
				options: { banner: '<%= meta.banner %>' },
				src: [
					'src/module.js',
					'src/**/*.js'
				],
				dest: 'dist/angular-apikeys.js'
			}
		},

		uglify: {
			options: {
				preserveComments: 'some'
			},
			dist : {
				files : { 'dist/angular-apikeys.min.js' : ['dist/angular-apikeys.js'] }
			}
		},

		jshint: {
			options : {
				jshintrc: '.jshintrc',
				ignores: []
			},
			all : ['src/**/*.js', 'tests/**/*.js', 'Gruntfile.js', 'index.js', 'karma.conf.js']
		},

		watch: {
			scripts : {
				files : ['./*.js', 'src/**/*.js', 'tests/*.js'],
				tasks : ['jshint', 'karma:once']
			}
		},

		karma: {
			// Karma watches
			auto: {
				configFile: 'karma.conf.js',
				autoWatch: true
			},
			// Grunt watches
			watched: {
				configFile: 'karma.conf.js',
				background: true
			},
			// Run once (for CI)
			once: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', ['jshint', 'karma:once']);
	grunt.registerTask('build', ['concat', 'uglify']);
	grunt.registerTask('default', ['build', 'test']);
};

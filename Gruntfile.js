'use strict';

/**
 * Grunt configuration.
 *
 * @param {object} grunt
 */
module.exports = function gruntConfiguration(grunt) {
  var jsFiles = [
        'Gruntfile.js',
        'index.js',
        'lib/*.js',
        'bin/*'
      ];

  grunt.initConfig({
    jsdoc: {
      dist: {
        src: [
          'index.js',
          'lib/*.js',
          'bin/*'
        ],
        options: {
          destination: 'docs'
        }
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: jsFiles
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: jsFiles
    },

    watch: {
      scripts: {
        files: jsFiles,
        tasks: ['lint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('default', ['dev']);
};

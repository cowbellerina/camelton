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
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('default', ['dev']);
};

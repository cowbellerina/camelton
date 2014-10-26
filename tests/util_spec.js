'use strict';

var fs = require('fs'),
    util = require('../lib/util.js');

exports.util = {
  resolveFile: function(test) {
    test.expect(1);
    test.equal(util.resolveFile('./tmp/DOES_NOT_EXIST'), false, 'False is returned when file does not exist.');
    test.done();
  },

  resolveEnsureFile: function(test) {
    var filePath = util.resolveEnsureFile('./tmp/file.js');
    test.expect(1);
    test.equal(fs.existsSync(filePath), true, 'File is created if it does not exist.');
    test.done();
  }
};

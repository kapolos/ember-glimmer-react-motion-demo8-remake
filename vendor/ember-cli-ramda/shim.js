(function() {
  /* globals define, R */

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  generateModule('R', { 'default': R });
})();

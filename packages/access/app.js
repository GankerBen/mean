'use strict';

var mean = require('meanio'),
  Module = mean.Module,
  passport = require('passport');

var Access = new Module('access');

Access.register(function(database) {

  var auth = require('./server/config/authorization');
  require('./server/config/passport')(passport);

  //********************************
  // 这是为了向后兼容
  //********************************
  mean.register('auth', function() {
    return auth;
  });

  mean.register('passport', function() {
    return passport;
  });

  Access.passport = passport;
  Access.middleware = auth;

  return Access;
});

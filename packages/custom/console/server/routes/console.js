'use strict';

var mean = require('meanio');

// The Package is past automatically as first parameter
module.exports = function (Console, app, auth, database) {

    app.get('/console/example/anyone', function (req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/console/example/auth', auth.requiresLogin, function (req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/console/example/admin', auth.requiresAdmin, function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    var ctrl = require('../controllers/console');

    // 创建APP
    app.route('/app-info').get(ctrl.getAppInfo);
    app.route('/create-app').post(ctrl.createApp);
    app.route('/console-reset-password').post(ctrl.resetPassword);
};

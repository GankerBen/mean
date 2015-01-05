'use strict';

// The Package is past automatically as first parameter
module.exports = function (Bukasystem, app, auth, database) {

    app.get('/bukasystem/example/anyone', function (req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/bukasystem/example/auth', auth.requiresLogin, function (req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/bukasystem/example/admin', auth.requiresAdmin, function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/bukasystem/example/render', function (req, res, next) {
        Bukasystem.render('index', {
            package: 'bukasystem'
        }, function (err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    //****************************************
    // API请求路由
    //****************************************

    // 初始化API
    var api = require('../controllers/bukaAPI');
    app.route('/api/*').get(api.apiHandler);
};

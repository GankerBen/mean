'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function (MeanUser, app, auth, database, passport) {

    // 登出
    app.route('/logout')
        .get(users.signout);

    //
//    app.route('/users/me')
//        .get(users.me);

    // 注册
    app.route('/register')
        .post(users.create);

    // 忘记密码
    app.route('/forgot-password')
        .post(users.forgotpassword);

    // 重置密码
    app.route('/reset/:token')
        .post(users.resetpassword);

    // Setting up the userId param
//    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function (req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    // Setting the local strategy route
    app.route('/login')
        // buka.tv项目使用passport-local中间件进行login验证
        .post(passport.authenticate('local', {
            failureFlash: true
        }), function (req, res) {

            // FIXME:
            // 登陆成功，在项目中此处可能还需要其他处理
            res.send({

                // passport.authenticate成功后，会在req上设置user属性
                user: req.user,
                redirect:  req.get('referer')
            });
        });

    // 用户修改了个人资料
    app.route('/save-change')
        .post(users.saveChange);

    // AngularJS route to get config of social buttons
    app.route('/get-config')
        .get(function (req, res) {
            res.send(config);
        });
};

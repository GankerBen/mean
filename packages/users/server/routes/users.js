'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function (MeanUser, app, auth, database, passport) {

    /*************************/
    // 登出
    /*************************/
    app.route('/logout')
        .get(users.signout);

    /*************************/
    // 注册
    /*************************/
    app.route('/register')
        .post(users.create);

    /*************************/
    // 忘记密码
    /*************************/
    app.route('/forgot-password')
        .post(users.forgotpassword);

    /*************************/
    // 重置密码
    /*************************/
    app.route('/reset/:token')
        .post(users.resetpassword);

    /*************************/
    // 查看登陆状态
    /*************************/
    app.route('/loggedin')
        .get(function (req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    /*************************/
    // 登陆
    /*************************/
    app.route('/login')
        .post(passport.authenticate('local', {
            failureFlash: true
        }), function (req, res) {
            res.send({
                //
                user: req.user,
                redirect: req.get('referer')
            });
        });

    /*************************/
    // 修改用户资料
    /*************************/
    app.route('/save-change')
        .post(users.saveChange);


    /******************************************************************************************/
    // FIXME:下面这些API将不会再被支持，但为了保持相关逻辑，暂时不会被删除！
    /******************************************************************************************/

    app.route('/get-config')
        .get(function (req, res) {
            res.send(config);
        });

    app.route('/users/me')
        .get(users.me);

    app.param('userId', users.user);
};

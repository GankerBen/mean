'use strict';

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
};

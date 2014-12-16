'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function (MeanUser, app, auth, database, passport) {

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个处理
    app.route('/logout')
        .get(users.signout);

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个处理
    app.route('/users/me')
        .get(users.me);

    // Setting up the users api
    app.route('/register')
        .post(users.create);

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个处理
    app.route('/forgot-password')
        .post(users.forgotpassword);

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个处理
    app.route('/reset/:token')
        .post(users.resetpassword);

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个处理
    // Setting up the userId param
    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function (req, res) {
            console.log("is authenticated", req.isAuthenticated());
            console.log("user", req.user);

            res.send(req.isAuthenticated() ? req.user : '0');
        });

    // 2014-12-15 pandazhong
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

                // FIXME: 此处暂时不能确定user是否需要roles字段！直接返回url
                //redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
                redirect:  req.get('referer')
            });
        });

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要这个路由

    // AngularJS route to get config of social buttons
    app.route('/get-config')
        .get(function (req, res) {
            res.send(config);
        });

    // FIXME:
    // 2014-12-15 pandazhong
    // buka.tv项目暂时不需要如下各个社交平台的验证

    // Setting the facebook oauth routes
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the github oauth routes
    app.route('/auth/github')
        .get(passport.authenticate('github', {
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the twitter oauth routes
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter', {
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the google oauth routes
    app.route('/auth/google')
        .get(passport.authenticate('google', {
            failureRedirect: '#!/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);

    app.route('/auth/google/callback')
        .get(passport.authenticate('google', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the linkedin oauth routes
    app.route('/auth/linkedin')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '#!/login',
            scope: ['r_emailaddress']
        }), users.signin);

    app.route('/auth/linkedin/callback')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '#!/login'
        }), users.authCallback);

};

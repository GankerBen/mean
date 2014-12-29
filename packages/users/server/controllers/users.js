'use strict';


/*******************************************/
// 依赖的模块
/*******************************************/
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    config = require('meanio').loadConfig(),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../template');


/*******************************************/
// 重定向至登陆页面
/*******************************************/
exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};


/*******************************************/
// 重定向至主页面
/*******************************************/
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};


/*******************************************/
// 保存用户对个信息的修改
/*******************************************/
exports.saveChange = function (req, res, next) {
    res.send('save change success');
    // TODO
};


/*******************************************/
// 注册
/*******************************************/
exports.create = function (req, res, next) {

    // 断言
    req.assert('full_name', 'You must enter a name').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('name', 'Username cannot be more than 20 characters').len(1, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    // FIXME: 如下字段需要在用户中心完善
    req.body.visibility = 10000000;
    req.body.about = 10000000;
    req.body.gender = 10000000;
    req.body.like = 10000000;
    req.body.birthday = 10000000;

    var user = new User(req.body);
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5

    user.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).json([
                        {
                            msg: 'Username already taken',
                            param: 'username'
                        }
                    ]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).json(modelErrors);
                    }
            }

            return res.status(400);
        }
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
        res.status(200);
    });
};


/*******************************************/
// 发送邮件
/*******************************************/
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function (err, response) {
        if (err) return err;
        return response;
    });
}


/*******************************************/
// 重置密码
/*******************************************/
exports.resetpassword = function (req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Token invalid or expired'
            });
        }
        req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err) {
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.send({
                    user: user
                });
            });
        });
    });
};


/*******************************************/
// 发送重置密码的链接到指定邮箱
/*******************************************/
exports.forgotpassword = function (req, res, next) {
    async.waterfall([

            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({
                    $or: [
                        {
                            email: req.body.text
                        },
                        {
                            username: req.body.text
                        }
                    ]
                }, function (err, user) {
                    if (err || !user) return done(true);
                    done(err, user, token);
                });
            },
            function (user, token, done) {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function (err) {
                    done(err, token, user);
                });
            },
            function (token, user, done) {
                var mailOptions = {
                    to: user.email,
                    from: config.emailFrom
                };
                mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
                sendMail(mailOptions);
                done(null, true);
            }
        ],
        function (err, status) {
            var response = {
                message: 'Mail successfully sent',
                status: 'success'
            };
            if (err) {
                response.message = 'User does not exist';
                response.status = 'danger';
            }
            res.json(response);
        }
    );
};

/******************************************************************************************/
// FIXME:下面这些API将不会再被支持，但为了保持相关逻辑，暂时不会被删除！
/******************************************************************************************/

/**
 * Send User
 */
exports.me = function (req, res) {
    res.json(req.user || null);console.log('send user', req.user);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
    res.redirect('/');
};
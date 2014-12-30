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
// 退出登陆
/*******************************************/
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
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
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
// 手机号格式验证
/*******************************************/
var phoneReg = /^1[3|4|5|8][0-9]\d{4,8}$/g;
function isPhoneNumber(num){
    return phoneReg.test(num);
}

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
    req.assert('full_name', '名字不能为空').notEmpty();

    // 支持手机号或邮箱注册，注意：email字段也可能表示手机号码
    var isPhone = isPhoneNumber(req.body.email);
    if(!isPhone){
        if(req.body.email.indexOf('@') < 0){
            return res.status(400).send('手机号码格式不正确');
        }
        req.assert('email', '邮箱号码格式不对').isEmail();
    }

    req.assert('password', '密码长度必须在8至20之间').len(8, 20);
    req.assert('name', '用户名长度必须在1至20之间').len(1, 20);
    req.assert('confirmPassword', '密码确认不一致').equals(req.body.password);

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
                            msg: '用户名已经存在',
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
// 发送短信
// TODO
/*******************************************/
function sendSMS(smsOptions){

}


/*******************************************/
// 重置密码
/*******************************************/
exports.resetpassword = function (req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token,
//        resetPasswordExpires: {
//            $gt: Date.now()
//        }
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
                message: '邮件已经成功发送',
                status: 'success'
            };
            if (err) {
                response.message = '该用户不存在';
                response.status = 'danger';
            }
            res.json(response);
        }
    );
};
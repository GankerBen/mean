'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var App = mongoose.model('App');

//**************************************
// 获取应用信息
// GET
// TODO:
//
//**************************************
exports.getAppInfo = function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(400).json({
            msg: '没有权限进行该操作'
        })
    }

    console.log('查找apps info');

    App.find({
        userID: req.user._id
    }, function (err, apps) {

        if (err) {
            return res.status(400).json({
                msg: err
            });
        }

        return res.send(apps);
    });
};

//**************************************
// 创建应用
// POST
// TODO:
//
//**************************************
exports.createApp = function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(400).json({
            msg: '没有权限进行该操作'
        })
    }
    console.log('创建APP', req.user);
    var app = new App({
        userID: req.user._id,
        name: req.body.appName,
        about: 'dummy about~',
        access_key_id: 'jfnkqwevfnwejnvwe' + Math.random(),//需要唯一生成
        secret_access_key: 'afnkwenvggjewnvew' + Math.random()
    });
    app.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).json({
                        msg: 'app名称已存在',
                        param: 'dummy'
                    });
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

        App.find({
            userID: req.user._id
        }, function (err, apps) {

            if (err) {
                return res.status(400).json({
                    msg: err
                });
            }

            return res.send(apps);
        });
    });
};

/*******************************************/
// 重置密码
/*******************************************/
exports.resetPassword = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(400).json({
            msg: '没有权限进行该操作！'
        });
    }
    User.findOne({
        _id: req.user._id
    }, function (err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: '没有权限进行该操作！'
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

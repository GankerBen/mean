'use strict';

/**
 * author: pandazhong
 * email: 449678910@qq.com
 * description: 用户模型定义
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('lodash');

/**
 * 验证邮箱号码的唯一性
 * @param value
 * @param callback
 */
var validateUniqueEmail = function (value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [
            {
                email: value
            },
            {
                _id: {
                    $ne: this._id
                }
            }
        ]
    }, function (err, user) {
        callback(err || user.length === 0);
    });
};

/**
 * Getter
 */
var escapeProperty = function (value) {
    return _.escape(value);
};

/**
 * User Schema
 */

var UserSchema = new Schema({

    // 用户真实名
    full_name: {
        type: String,
        required: true
    },

    // 用户昵称
    name: {
        type: String,
        required: true
    },

    // 密码
    password: {
        type: String,
        required: true
    },

    // 邮箱号码
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },

    // 帐号的可见性(可否被站内搜索等)
    visibility: {
        type: String
    },

    // 描述
    about: {
        type: String
    },

    // 头像URL
    profile: {
        type: String
    },

    // 性别
    gender: {
        type: String
    },

    // 喜欢的POST类型，包括文字、图片、video、live video等等
    like: {
        type: String
    },

    // 出生日期
    birthday: {
        type: Number
    }

    // 手机号码
    // FIXME:暂时没有添加手机号码格式验证
    //phone: {
        //type: String,
        //required: true,
        //unique: true
    //}
});

/**
 * Virtuals
 * 虚拟属性，用做属性别名，类似 AS3中的getter、setter属性方法，使用
 * 虚拟属性可以对set或get操作进行监控
 */
//UserSchema.virtual('password').set(function (password) {
//    this.password = password;
//}).get(function () {
//    return this.password;
//});

/**
 * Pre-save hook
 * 在save之前做一些操作
 */
UserSchema.pre('save', function (next) {
//    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
//        return next(new Error('Invalid password'));
    next();
});

/**
 * Methods
 * 定义一组实例方法，
 * example:
 * var UserScheme = mongoose.model('User');
 * var user = new UserScheme({});
 * user.dummy();
 * user.dummy2();
 */
UserSchema.methods = {
    dummy: function () {
        
    },
    
    dummy2: function () {

    }
};

mongoose.model('User', UserSchema);

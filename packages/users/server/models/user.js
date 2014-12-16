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

// 2014-12-15
// FIXME: 暂时不需要这个验证方法
/**
 * Validations
 */
var validatePresenceOf = function (value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (this.provider && this.provider !== 'local') || (value && value.length);
};

// 2014-12-15
// FIXME:验证邮箱号码的唯一性
var validateUniqueEmail = function (value, callback) {
    console.log("email", value);
    var User = mongoose.model('User');
    User.find({
        $and: [
            {
                user_email_address: value
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
    user_full_name: {
        type: String,
        required: true
    },

    // 用户名
    user_name: {
        type: String,
        required: true
    },

    // 用户ID
    user_id: {
        type: String,
        unique: true
    },

    // 用户密码
    user_password: {
        type: String,
        required: true
    },

    // 用户上一次登陆的时间
    user_last_login_time: {
        type: Number
    },

    // 用户上一次登陆的IP
    user_last_login_ip: {
        type: String
    },

    // 用户的邮箱号码
    user_email_address: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        validate: [validateUniqueEmail, 'E-mail address is already in-use']
    },

    // 用户帐号的可见性(可否被站内搜索)
    // FIXME: 暂时不需要这个字段
    user_account_visibility: {
        type: String
    },

    // 用户描述
    user_about: {
        type: String
    },

    // 用户头像URL
    user_profile_photo_url: {
        type: String
    },

    // 用户性别
    user_gender: {
        type: String
    },

    // 用户喜欢的POST类型，包括文字、图片、video、live video等等
    user_like_to_post_about: {
        type: String
    },

    // 用户生日
    user_was_born_on: {
        type: Number
    }

    // 用户手机号码
    // FIXME:暂时没有添加手机号码格式验证
    //user_cellphone_number: {
        //type: String,
        //required: true,
        //unique: true
    //}
});

// 虚拟属性，用做属性别名，类似 AS3中的getter、setter属性方法，使用
// 虚拟属性可以对set或get操作进行监控。
/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
    this.user_password = password;
}).get(function () {
    return this.user_password;
});

// FIXME:暂时不需要这个hook！
/**
 * Pre-save hook
 */
//UserSchema.pre('save', function (next) {
//    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
//        return next(new Error('Invalid password'));
//    next();
//});

/**
 * Methods
 */
UserSchema.methods = {
    // TODO:自定义方法，格式如 funcName: function(args){}，多个方法用 ',' 隔开
};

mongoose.model('User', UserSchema);

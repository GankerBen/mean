'use strict';


/*******************************************/
// App模型用于统计用户的应用程序信息
/*******************************************/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('lodash');


/*******************************************/
// 对字符串进行转义
/*******************************************/
var escapeProperty = function (value) {
    return _.escape(value);
};

/*******************************************/
// App数据模型
// FIXME:还有许多业务上的字段有待添加
/*******************************************/
var AppSchema = new Schema({

    // app名称
    name: {
        type: String,
        required: true
    },

    userID:{
        type: String,
        required: true
    },

    // app描述信息
    about: {
        type: String
    },

    access_key_id:{
        type: String,
        unique: true,
        required: true
    },

    secret_access_key:{
        type: String,
        unique: true,
        required: true
    }
});

mongoose.model('App', AppSchema);

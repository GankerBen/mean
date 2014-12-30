'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    os = require('os'),
    isProductionEnv;

//******************************
// 是否在生产环境中，
// 目前项目是在win7上开发，
// 在linux上部署。
//******************************
isProductionEnv = os.type().toLowerCase().indexOf('win') === -1;

module.exports = {
    root: rootPath,
    http: {
        port: isProductionEnv ? 80 : process.env.PORT || 3000
    },
    https: {
        port: false,

        // Paths to key and cert as string
        ssl: {
            key: '',
            cert: ''
        }
    },
    hostname: isProductionEnv ? '0.0.0.0' : process.env.HOST || process.env.HOSTNAME,
    db: process.env.MONGOHQ_URL,
    templateEngine: 'swig',

    //******************************
    // 用于计算session hash，
    // 建议改成不容易被猜到的密码。
    //******************************
    sessionSecret: 'buka',

    //******************************
    // Mongodb中
    // 用于存储session的集合名
    //******************************
    sessionCollection: 'sessions',

    //******************************
    // session的cookie设置
    //******************************
    sessionCookie: {
        path: '/',
        httpOnly: true,
        // If secure is set to true then it will cause the cookie to be set
        // only when SSL-enabled (HTTPS) is used, and otherwise it won't
        // set a cookie. 'true' is recommended yet it requires the above
        // mentioned pre-requisite.
        secure: false,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null
    },

    // The session cookie name
    sessionName: 'connect.sid'
};



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
        port: false//isProductionEnv ? 80 : process.env.PORT || 3000
    },
    https: {
        port: isProductionEnv ? 443 : process.env.PORT || 3000,

        //*****************************************
        // 私钥key文件与证书文件的路径
        // 如何生成这两个文件?

        // 1.生成私钥key文件
        // openssl genrsa -out privatekey.pem 1024
        //
        // 2.通过私钥生成CSR证书签名
        // openssl req -new -key privatekey.pem -out certrequest.csr

        // 3.通过私钥和证书签名生成证书文件
        // openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

        //*****************************************
        ssl: {
            key: './config/env/cert/privatekey.pem',
            cert: './config/env/cert/certificate.pem'
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
        secure: true,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null
    },

    // The session cookie name
    sessionName: 'connect.sid'
};



'use strict';

module.exports = {
    db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-test',
    http: {
        port: 3001
    },
    app: {
        name: 'Test'
    },
    //*************************************
    // 通过QQ邮箱服务给用户发送邮件
    // FIXME:此处需要替换成公司的邮箱号码！
    //*************************************
    emailFrom: '15810990285@qq.com',
    mailer: {
        service: 'QQ',
        auth: {
            user: '15810990285@qq.com',
            pass: 'iloveyou9993344?'
        }
    }
};

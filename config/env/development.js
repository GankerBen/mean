'use strict';

module.exports = {
    db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
    debug: true,

    //*************************************
    // 是否压缩资源文件，
    // 这可以减少前后端通信次数
    //*************************************
    aggregate: true,
    mongoose: {
        debug: false
    },
    app: {
        name: 'myApp'
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

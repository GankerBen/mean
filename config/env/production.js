'use strict';

module.exports = {
    db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-prod',
    /**
     * Database options that will be passed directly to mongoose.connect
     * Below are some examples.
     * See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
     * and http://mongoosejs.com/docs/connections.html for more information
     */
    dbOptions: {
        /*
         server: {
         socketOptions: {
         keepAlive: 1
         },
         poolSize: 5
         },
         replset: {
         rs_name: 'myReplicaSet',
         poolSize: 5
         },
         db: {
         w: 1,
         numberOfRetries: 2
         }
         */
    },
    app: {
        name: 'MEAN - A Modern Stack - Production'
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

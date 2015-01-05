'use strict';

var mean = require('meanio');
var url = require('url');
var crypto = require('crypto');

//****************************************
// 支持的API版本
//****************************************
var apiVersions = ['1'];

//****************************************
// API 指令
//****************************************
var actionHandlers = {
    // FIXME:
    dummy1: dummy1Handler,
    dummy2: dummy2Handler,
    dummy3: dummy3Handler
};

//****************************************
// 错误码
//****************************************
var errorCodes = {
    // FIXME:
    no_action: new Buffer('no_action'),
    no_timestamp: new Buffer('no_timestamp'),
    no_access_key_id: new Buffer('no_access_key_id'),
    no_version: new Buffer('no_version'),
    no_signature_method: new Buffer('no_signature_method'),
    no_signature: new Buffer('no_signature'),
    action_not_exists: new Buffer('action_not_exists'),
    signature_method_not_exists: new Buffer('signature_method_not_exists'),
    signature_version_not_exists: new Buffer('signature_version_not_exists'),
    api_version_not_exists: new Buffer('api_version_not_exists')
};

//****************************************
// 支持的加密算法
//****************************************
var algorithms = ['sha1', 'sha256'];

//****************************************
// 公共参数
// FIXME
//****************************************
var publicParams = [
    'action',
    'access_key_id',
    'timestamp',
    'version',
    'signature_method',
    'signature'
];

var numPublicParams = publicParams.length;

//****************************************
// 不需要排序的参数
// FIXME
//****************************************
var sortFilter = ['signature'];

//****************************************
// API 请求处理
//****************************************
exports.apiHandler = function(req, res) {

    var query,                      // API请求串 string
        param, sha1,                // 临时用
        action,                     // 请求的action string
        algorithmExists,            // 加密算法是否存在
        paramsExists,               // 请求串中是否含有所有的公共参数 boolean或者buffer
        actionExists,               // action是否有效 boolean
        sortParams,                 // 一个数组，包含了一组按升序排列的请求串中的key array
        rebuildURL,                 // 重新构造的URL string
        rebuildSignature,           // 重新构造的签名 string
        rebuildSignatureString;     // 重新构造的被签名的串 string

    query = url.parse(req.url, true).query;
    action = query.action;
    actionExists = actionHandlers[action] !== undefined;

    if(!actionExists)
    {
        return res.send(errorCodes.action_not_exists);
    }

    algorithmExists = algorithms.indexOf(query.signature_method) >= 0;

    if(!algorithmExists){
        return res.send(errorCodes.signature_method_not_exists);
    }

    paramsExists = checkNecessaryParams(query);

    if(paramsExists !== true)
    {
        return res.send(paramsExists);
    }

    sortParams = sort(query);
    console.log(sortParams);

    //********************************验证API请求的签名****************************//
    //1.重建URL
    rebuildURL = '';
    for(var i = 0, len = sortParams.length; i != len; ++i){
        param = sortParams[i];
        rebuildURL += param;
        rebuildURL += '=';
        rebuildURL += query[param];

        if(i != len - 1){
            rebuildURL += '&';
        }
    }

    //2.重建被签名串
    rebuildSignatureString = 'GET' + '\n' + '/api/' + '\n' + rebuildURL;

    //3.计算签名，密钥的私钥暂时为449678910
    sha1 = crypto.createHmac(query.signature_method, '449678910');
    sha1.update(rebuildSignatureString);
    rebuildSignature = new Buffer(sha1.digest('hex')).toString('base64').trim();
    rebuildSignature = rebuildSignature.replace(/\s/g,'+');
    console.log('rebuildSignature', rebuildSignature);

    //4.验证签名
    if(rebuildSignature != query.signature){
        res.send('非法的签名');
    }else{
        return actionHandlers[action](req, res, query);
    }
};

//****************************************
// 检查API请求串中是否包含了所有的 公共参数
// FIXME:
//****************************************
function checkNecessaryParams(query){

    var num = 0;
    for(var i = 0; i != numPublicParams; ++i){
        var param = publicParams[i];
        if(param in query){
            num++;
        }else{
            break;
        }
    }

    if(num==numPublicParams){
        return true;
    }else{
        return errorCodes['no_' + param];
    }
}

//****************************************
// 按升序排序
// FIXME:
//****************************************
function sort(query) {
    var tmpArr = [];
    for(var key in query){
        if(sortFilter.indexOf(key) < 0){
            tmpArr.push(key);
        }
    }
    return tmpArr.sort();
}

//****************************************
// action handler
// FIXME:
//****************************************
function dummy1Handler(req, res, query){
    // TODO
    return res.send('dummy1 handler called');
}

function dummy2Handler(req, res, query){
    // TODO
    return res.send('dummy2 handler called');
}

function dummy3Handler(req, res, query){
    // TODO
    return res.send('dummy3 handler called');
}
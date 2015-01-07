'use strict';

angular.module('mean.console').factory('Console', [
    function () {
        return {
            name: 'console'
        };
    }
])
    // 创建APP
    .service('AppCreator', ['Global', '$http', '$timeout', function (Global, $http, $timeout) {

        var appExists = function (appName) {
            var apps = Global.appInfo;
            if(apps.length==undefined){
                return false;
            }
            for(var i = 0, len=apps.length; i != len; ++i){
                var app = apps[i];
                if(app.name == appName){
                    return true;
                }
            }

            return false;
        };
        
        var resetMessage = function () {
            var time = $timeout(function () {
                $timeout.cancel();
                Global.console.response.message = '';
            }, 2000);
        };

        this.createApp = function () {
            var appName = Global.console.tempApp.name;
            if(!appName){
                Global.console.response.status = 'warning';
                Global.console.response.message = '应用程序名称不能为空！';
                resetMessage();
            }else if(appExists(appName)){
                Global.console.response.status = 'warning';
                Global.console.response.message = '应用程序已经存在！';
                resetMessage();
            }else{
                $http.post('/create-app', {
                    appName: appName
                })
                    .success(function (response) {
                        Global.appInfo = response;
                        Global.console.response.status = 'success';
                        Global.console.response.message = '创建成功！';
                        resetMessage();
                    })
                    .error(function (error) {
                        Global.console.response.status = 'danger';
                        Global.console.response.message = '应用程序已经存在';
                        resetMessage();
                    });

                Global.console.tempApp.name = '';
                Global.console.response.message = '';
            }
        };
    }]);

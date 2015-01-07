'use strict';

angular.module('mean.console')
    .controller('ConsoleController', ['$scope', 'Global', 'Console',
        function ($scope, Global, Console) {
            $scope.global = Global;
            $scope.package = {
                name: 'console'
            };
        }
    ])

    // 应用页面总控制器
    .controller('ApplicationCtrl', ['$scope', '$http', 'Global',
        function ($scope, $http, Global) {
            $scope.global = Global;

            if(!Global.console){
                Global.console = {
                    tempApp:{
                        name:''
                    },
                    response:{
                        status:'',
                        message:''
                    }
                };
            }

            // FIXME:需要向服务器请求该用户的应用信息，而不是写死
            // 暂时假设用户不能删除app信息，所以只需要在没有appInfo的情况下去请求
            // $scope.appInfo

            if(!$scope.global.appInfo){
                $http.get('/app-info').success(function (response) {
                    console.log('获取到用户的apps', response);
                    $scope.global.appInfo = response.length > 0 ? response : false;
                })
            }
        }
    ])

    // 创建APP TODO
    .controller('CreateAppCtrl', ['$scope', '$http', 'Global', 'AppCreator',
        function ($scope, $http, Global, AppCreator) {
            $scope.global = Global;
            $scope.createApp = AppCreator.createApp;
            if(!Global.console){
                Global.console = {
                    tempApp:{
                        name:''
                    },
                    response:{
                        status:'',
                        message:''
                    }
                };
            }
        }
    ])

    // 显示app信息 TODO
    .controller('AppsInfoCtrl', ['$scope', '$http', 'Global', 'AppCreator',
        function ($scope, $http, Global, AppCreator) {
            $scope.global = Global;
            $scope.createApp = AppCreator.createApp;
        }
    ])

    // 重置密码
    .controller('ResetPasswordCtrl', ['$scope', '$http', 'Global',
        function ($scope, $http, Global) {
            $scope.global = Global;
            $scope._profile = {
                newPassword:'',
                confirmNewPassword:''
            };

            $scope._profile.resetPassword = function () {
                if(!$scope._profile.newPassword || !$scope._profile.confirmNewPassword){
                    $scope._profile.status = 'danger';
                    $scope._profile.resetPasswordError = '密码不能为空！';
                    return;
                }

                console.log('post now! reset password');
                $http.post('/console-reset-password', {
                    password: $scope._profile.newPassword,
                    confirmPassword: $scope._profile.confirmNewPassword
                })
                    .success(function (response) {
                        $scope._profile.status = 'success';
                        $scope._profile.resetPasswordError = '密码修改成功！';
                    })
                    .error(function (error) {
                        $scope._profile.status = 'danger';
                        $scope._profile.resetPasswordError = error;
                    })
            }
        }
    ]);

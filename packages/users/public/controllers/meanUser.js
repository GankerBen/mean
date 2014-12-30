'use strict';
// To avoid displaying unneccesary social logins
var clientIdProperty = 'clientID',
    defaultPrefix = 'DEFAULT_';

angular.module('mean.users')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            // This object will be filled by the form
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.input = {
                type: 'password',
                placeholder: 'Password',
                confirmPlaceholder: 'Repeat Password',
                iconClass: '',
                tooltipText: 'Show password'
            };

            $scope.togglePasswordVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
                $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
            };

            $scope.login = function () {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .success(function (response) {
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');

                        // FIXME:强制导航到主页可能会有BUG，如果不这样，整个页面会重新加载，并导致AngularJS重新初始化，相关的数据会被清除

                        $location.url('/');
                    })
                    .error(function () {
                        $scope.loginerror = 'Authentication failed.';
                    });
            };
        }
    ])

    // FIXME: 暂时只支持通过邮箱号码创建角色
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = true;
            $scope.input = {
                type: 'password',
                placeholder: 'Password',
                placeholderConfirmPass: 'Repeat Password',
                iconClassConfirmPass: '',
                tooltipText: 'Show password',
                tooltipTextConfirmPass: 'Show password'
            };

            $scope.togglePasswordVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
                $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
            };
            $scope.togglePasswordConfirmVisible = function () {
                $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
                $scope.input.placeholderConfirmPass = $scope.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
                $scope.input.iconClassConfirmPass = $scope.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
                $scope.input.tooltipTextConfirmPass = $scope.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
            };

            $scope.register = function () {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/register', {
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword,
                    name: $scope.user.username,
                    full_name: $scope.user.name
                })
                    .success(function () {
                        // authentication OK
                        $scope.registerError = 0;

                        // FIXME:提交过程中，如果用户修改输入框的内容，可能会造成bug！
                        $rootScope.user = {
                            email: $scope.user.email,
                            password: $scope.user.password,
                            confirmPassword: $scope.user.confirmPassword,
                            username: $scope.user.username,
                            name: $scope.user.name
                        };

                        Global.user = $rootScope.user;
                        Global.authenticated = !!$rootScope.user;
                        $rootScope.$emit('loggedin');
                        $location.url('/');
                    })
                    .error(function (error) {
                        // Error: authentication failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = error;
                        } else if (error === 'Email already taken') {
                            $scope.emailError = error;
                        } else $scope.registerError = error;
                    });
            };
        }
    ])
    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.forgotpassword = function () {
                $http.post('/forgot-password', {
                    text: $scope.user.email
                })
                    .success(function (response) {
                        $scope.response = response;
                    })
                    .error(function (error) {
                        $scope.response = error;
                    });
            };
        }
    ])
    .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
        function ($scope, $rootScope, $http, $location, $stateParams, Global) {
            $scope.user = {};
            $scope.global = Global;
            $scope.global.registerForm = false;
            $scope.resetpassword = function () {
                $http.post('/reset/' + $stateParams.tokenId, {
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword
                })
                    .success(function (response) {
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $location.url('/');
                        }
                    })
                    .error(function (error) {
                        if (error.msg === 'Token invalid or expired')
                            $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
                        else
                            $scope.validationError = error;
                    });
            };
        }
    ])
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {

            // FIXME:暂时使用本地虚拟数据
            // $http.get('/get-user-info').success(function(info){todo})
            $scope.global = Global;
            $scope.global.user.profile = 'dummy';

            // 存档事件(Archived Events)
            $scope.global.archivedEvents = [1, 2, 3, 4, 5];

            // 草稿事件(Draft Events)
            $scope.global.draftEvents = [1, 2, 3, 4, 5];

            // 正在直播、将要直播的事件(Live Events)
            $scope.global.liveEvents = [1, 2, 3, 4, 5];

            // 编辑帐号
            $scope.editAccount = function () {

            }
        }
    ])
    .controller('editAccountCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
        function ($scope, $rootScope, $http, $location, Global) {

            // FIXME:暂时使用本地虚拟数据
            $scope.global = Global;
            $scope.global.user.full_name = 'your full name';
            $scope.global.user.email = 'your email';
            $scope.global.user.profile = 'your profile photo';

            $scope.createTempUser = function () {
                return {
                    full_name: $scope.global.user.full_name,
                    email: $scope.global.user.email,
                    profile: $scope.global.user.profile
                };
            }

            // 临时用于显示的用户字段信息
            $scope.global.tempUser = $scope.createTempUser();

            // 保存改动
            $scope.saveChange = function () {

                // 提交改动之前先确认确实有改动
                if ($scope.diff()) {
                    $http.post('/save-change', {
                        email: $scope.global.tempUser.email,
                        full_name: $scope.global.tempUser.full_name
                    }).success(function (user) {
                        console.log('改动已生效');
                        $scope.global.tempUser = $scope.createTempUser();
                    })
                }
            };

            $scope.diff = function () {
                if ($scope.global.tempUser.full_name == $scope.global.user.full_name
                    && $scope.global.tempUser.email == $scope.global.user.email
                    && $scope.global.tempUser.profile == $scope.global.user.profile) {
                    console.log('no change');
                    return false;
                }

                console.log('changed!');

                return true;
            };
        }
    ]);

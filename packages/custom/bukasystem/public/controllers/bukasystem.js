'use strict';

angular.module('mean.bukasystem')
    .controller('BukasystemController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])
    .controller('ProductController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])
    .controller('CaseController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])
    .controller('PriceController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])


    .controller('DocsController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])
    .controller('AboutController', ['$scope', 'Global', 'Bukasystem',
        function ($scope, Global, Bukasystem) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };
        }
    ])
    .controller('ConsoleController', ['$scope', 'Global', 'Bukasystem', '$http',
        function ($scope, Global, Bukasystem, $http) {
            $scope.global = Global;
            $scope.package = {
                name: 'bukasystem'
            };

            // TEST
//            var url, signatureString, signature, params, param, sha1;
//
//            params = {
//                action: 'dummy1',
//                version: '1',
//                timestamp: '100001010',
//                signature_method: 'sha1',
//                access_key_id: 'hello+world'
//            };
//
//            var sortParams = [];
//            for(var key in params){
//                sortParams.push(key);
//            }
//
//            sortParams = tmpArr.sort();
//
//            //1.构造URL
//            url = '';
//            for(var i = 0, len = sortParams.length; i != len; ++i){
//                param = sortParams[i];
//                url += param;
//                url += '=';
//                url += params[param];
//
//                if(i != len - 1){
//                    url += '&';
//                }
//            }
//
//            //2.构造被签名串
//            signatureString = 'GET' + '\n' + '/api/' + '\n' + url;
//
//            //3.计算签名，密钥的私钥暂时为449678910
//            sha1 = crypto.createHmac(params.signature_method, '449678910');
//            sha1.update(signatureString);
//            signature = new Buffer(sha1.digest('hex')).toString('base64').trim();
//            signature = signature.replace(/\s/g,'+');
//            url += '&signature=';
//            url += signature;
//
//            $http.get(
//                '/api/?' + url).success(function (data) {
//                console.log('API call result:', data);
//            })
        }
    ]);

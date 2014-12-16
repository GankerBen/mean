'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [

    function () {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: false,
            isAdmin: false
        };

        if (window.user) {
            _this._data.authenticated = !!window.user._id;
            _this._data.isAdmin = !!window.user._id;
        }
        return _this._data;
    }
]);

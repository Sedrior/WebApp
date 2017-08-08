scotchApp.factory('socket', function ($rootScope) {
    var socket = io.connect('https://notify.insoftd.com:9910/socket.io/?companyId=248');
    var notifications = [];
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function ()
                {
                    callback.apply(socket, args);
                    notifications.push(args);
                    debugger;
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
        , notifications: notifications
    };
});/**
 * Created by Daniel on 8/8/2017.
 */

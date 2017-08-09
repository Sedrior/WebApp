scotchApp.factory('socket', function ($rootScope) {
    var socket = null;

    var connect = function()
    {
        if(!socket)
        {
            socket = io.connect('https://notify.insoftd.com:9910?companyId=248', {forceNew:true});
        }
        console.dir(socket);
        return socket;
    };

    var listenOn = function (eventName, callback)
    {
        socket.on(eventName, function () {
            var args = arguments[0].params;
            $rootScope.$broadcast('HEYYYYYYY');
            $rootScope.$apply(function ()
            {$rootScope.$broadcast('HEYYYYYYY');
                callback(eventName, args);
            });
        });
    };

    var emitOn = function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments[0].params;
            $rootScope.$apply(function () {
                if (callback) {
                    callback(eventName, args);
                }
            });
        })
    };
    var getSocketConnected = function()
    {
      // if(socket)
          return socket ? socket.connected: false;
    };
    // var notifications = [];
    return {
        on: listenOn,
        emit: emitOn,
        connect: connect
        , server : socket
    };
});/**
 * Created by Daniel on 8/8/2017.
 */

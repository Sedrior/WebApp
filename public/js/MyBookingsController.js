scotchApp.controller('MyBookingsController',
    function($scope, $http, $cookieStore) {
        if($cookieStore.get('key')) {
            $scope.Bookings = [];
            $scope.type = [];
            var i, j;
            $scope.getBookings = function () {
                var Key = $cookieStore.get('key');
                $http.defaults.headers.common['Authorization'] = 'Basic ' + Key;
                var url = 'https://api-test.insoftd.com/v1/client/booking?q=[{"key":"Booking.id_client","op":"=", "value":"1"}]&limit=10';
                $http.get(url).then(
                    function (obj) {

                        $scope.Bookings = obj.data.records;
                        console.dir($scope.Bookings);
                        var url2 = 'https://api-test.insoftd.com/v1/client/car_type';
                        $http.get(url2).then(
                            function (obj2) {

                                $scope.type = obj2.data.records;
                                console.dir($scope.type);
                                for (i = 0; i < $scope.Bookings.length; i++) {
                                    for (j = 0; j < $scope.type.length; j++) {
                                        if ($scope.Bookings[i].id_car_type == $scope.type[j].id_type) {
                                            $scope.Bookings[i].id_car_type = $scope.type[j].type;
                                        }
                                    }
                                }
                            },
                            function () {
                                console.dir('error');
                            }
                        );

                    },
                    function () {
                        console.dir('error');
                    }
                );

            };

        }
        else{
            window.location='/#/';
            alert('You must log in first.')
        }



    });

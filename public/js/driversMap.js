/**
 * Created by Daniel on 8/8/2017.
 */
scotchApp.controller('DriversMap',
    function($scope,$http,$timeout,$cookieStore,$interval,$rootScope, socket)
    {


        $scope.drivers=[];
        $scope.available=[];
        var string='';
        $scope.getDrivers = function()
        {
            var i;
            var url='https://api-test.insoftd.com/v1/client/driver_to_car/monitoring_list?fields=(Driver.tag;Driver.first_name;Driver.last_name;Car.id_car;Car.model;Car.reg_number;CarType.rank;CarType.type;Driver.id;Driver.picture;DriverToCar.available_from;DriverToCar.id_driver_to_car;DriverToCar.updated_at;DriverToCar.lat;DriverToCar.id_plot_zone;DriverToCar.lng;DriverToCar.speed;DriverToCar.accuracy)&order=(DriverToCar.order_number%20ASC)';
            var Key=$cookieStore.get('key');
            $http.defaults.headers.common['Authorization'] = 'Basic '+ Key;
            $http.get(url).then(
                function(obj)
                {
                    var iconBase= "https://image.ibb.co/hQJzNF/default.png";
                    for(i=0;i<obj.data.records.length;i++) {
                        $scope.drivers[i] = obj.data.records[i];
                        console.dir($scope.drivers[i]);
                        if(obj.data.records[i].Bookings) {
                            $scope.available[i] = $scope.drivers[i].Bookings[i];
                            string='Driver:' + $scope.drivers[i].first_name + ' ' + $scope.drivers[i].last_name + '\n' + 'Status: Away';
                            if($scope.available[i].status=='DOW'){
                                iconBase= "https://image.ibb.co/fVnR2F/real_estate.png";
                            }
                            else
                            if($scope.available[i].status=='DAP'){
                                iconBase="https://image.ibb.co/b1Rawa/clubs.png";
                            }
                            else
                            if($scope.available[i].status=='POB'){
                                iconBase="https://image.ibb.co/b4ujpv/schools.png"
                            }
                        }
                        else{
                            string='Driver: ' + $scope.drivers[i].first_name + ' ' + $scope.drivers[i].last_name + '\n' + 'Status: Available';
                        }
                        $scope.drivers[i].lat=Number($scope.drivers[i].lat);
                        $scope.drivers[i].lng=Number($scope.drivers[i].lng);
                        var myLatLng={lat:$scope.drivers[i].lat, lng:$scope.drivers[i].lng}
                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: mapEngland,
                            title: string,
                            icon: iconBase
                        });
                        marker.setMap(mapEngland);
                    }

                },
                function()
                {
                    console.dir("error");
                }
            );


        };
        $scope.getDrivers();
        var initMap = function ()
        {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService = new google.maps.DirectionsService();
            console.dir(document.getElementById('mapEngland'));
            mapEngland = new google.maps.Map(document.getElementById('mapEngland'), {
                center: {lat: 45.86667, lng: 24.78333},
                zoom: 7
            });
            directionsDisplay.setMap(mapEngland);
        };



        $timeout(function ()
        {
            initMap();
        }, 50);

        socket.connect();
        console.dir(socket);
        socket.on('monitoring', function (ev, data)
        {
            console.dir(ev);
            console.dir(data);
            for(var name in data.Booking){
                console.dir(name);
            }
            console.dir(data.Booking[name]);
            var i;
            for(i=0;i<$scope.drivers.length;i++){
                if($scope.drivers[i].id_driver_to_car==data.Booking[name].id_driver_to_car){
                    $scope.drivers[i].status=data.Booking[name].status;
                    break;
                }
            }
            $scope.getDrivers();
        });
    });

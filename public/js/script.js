var scotchApp = angular.module('scotchApp', ['ngRoute','ngCookies']);

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl:'Login.html',
            controller:'LoginController'
        })

        .when('/newBooking', {
            templateUrl : 'NewBooking.html',
            controller  : 'BookingController'
        })


        .when('/myProfile', {
            templateUrl : 'MyProfile.html',
            controller  : 'ProfileController'
        })


        .when('/myBookings', {
            templateUrl : 'MyBookings.html',
            controller  : 'MyBookingsController'
        })
        .when('/editProfile',{
            templateUrl : 'EditProfile.html',
            controller : 'EditController'
        })
        .when('/driversMap',{
            templateUrl : 'DriversMap.html',
            controller : 'DriversMap'
        });
});

// create the controller and inject Angular's $scope
scotchApp.controller('BookingController',
    function($timeout, $scope, $window, $filter, $http, $cookieStore, $interval)
    {
        if($cookieStore.get('key')) {
            var key = $cookieStore.get('key');

            $scope.pickup_show = false;
            $scope.dropoff_show = false;
            var initMap = function () {
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsService = new google.maps.DirectionsService();
                console.dir(document.getElementById('map'));
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: 45.86667, lng: 24.78333},
                    zoom: 6
                });
                directionsDisplay.setMap(map);
            };

            var name = $scope.fullName;
            var email = $scope.email;
            var phoneNumber = $scope.phoneNumber;
            var voucherCode = $scope.voucherCode;
            $scope.temp = {
                showPlace: false,
                pickUp: {
                    addressName: '',
                    lat: '',
                    lng: ''
                },
                dropOff: {
                    addressName: '',
                    lat: '',
                    lng: ''
                },
                pickUpSearch: {},
                dropOffSearch: {}
            };

            $scope.distance = {
                carType: '',
                distance: '',
                price: ''
            };
            $scope.data = [];
            $scope.numberOfSeats = [];
            $scope.cars = {};
            $scope.paymentMethod = [];
            $scope.booking_charge = {};
            $scope.paymentsMethod = 'cash';
            $scope.idTypeCars = [];

            $scope.searchLocation = function () {
                var request = {
                    input: $scope.temp.pickUp.addressName,
                    componentRestrictions: {country: 'ro'}
                };
                var service = new google.maps.places.AutocompleteService();
                service.getPlacePredictions(request, function (predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    else {
                        console.dir(predictions);
                        $scope.temp.pickUpSearch = predictions;

                    }

                });
            };


            $scope.searchLocation2 = function () {
                var request = {
                    input: $scope.temp.dropOff.addressName,
                    componentRestrictions: {country: 'ro'}
                };
                var service = new google.maps.places.AutocompleteService();
                service.getPlacePredictions(request, function (predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    else {
                        console.dir(predictions);
                        $scope.temp.dropOffSearch = predictions;
                    }
                });
            };


            $scope.setLocation = function (obj, type) {
                if (type !== 'p') {

                    console.dir(obj);
                }
                else {
                    // console.dir(angular.element('#pickup')0);
                    // document.getElementById('pS').style.display  = "none";
                    //  debugger;
                    $scope.pickup_show = false;
                    var geocoder = new google.maps.Geocoder;
                    console.dir(obj);
                    geocoder.geocode({'placeId': obj.place_id}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.dir(status);
                            console.dir(results);
                            map.setCenter(results[0].geometry.location);
                            $scope.temp.pickUp.addressName = results[0].formatted_address;
                            $scope.temp.pickUp.lat = results[0].geometry.location.lat();
                            $scope.temp.pickUp.lng = results[0].geometry.location.lng();
                            var request = {
                                origin: $scope.temp.pickUp.addressName,
                                destination: $scope.temp.dropOff.addressName,
                                travelMode: google.maps.DirectionsTravelMode.DRIVING
                            };
                            if ($scope.temp.pickUp.addressName && $scope.temp.dropOff.addressName) {
                                directionsService.route(request, function (result, status) {
                                    if (status === google.maps.DirectionsStatus.OK) {
                                        $scope.distance.distance = result.routes[0].legs[0].distance.value;
                                        directionsDisplay.setDirections(result);
                                        if($scope.temp.dropOff && $scope.temp.pickUp){
                                            $scope.getCarPrice();
                                        }
                                    }
                                });

                            }

                        }
                        else {
                            console.dir(status);
                            console.dir(results);

                        }
                        console.dir($scope.temp);
                    });

                }
            };


            $scope.setLocation2 = function (obj, type) {
                if (type !== 'd') {
                    console.dir(obj);
                }
                else {
                    $scope.dropoff_show = false;
                    var geocoder = new google.maps.Geocoder;
                    console.dir(obj);
                    geocoder.geocode({'placeId': obj.place_id}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.dir(status);
                            console.dir(results);
                            map.setCenter(results[0].geometry.location);
                            $scope.temp.dropOff.addressName = results[0].formatted_address;
                            $scope.temp.dropOff.lat = results[0].geometry.location.lat();
                            $scope.temp.dropOff.lng = results[0].geometry.location.lng();
                            var request = {
                                origin: $scope.temp.pickUp.addressName,
                                destination: $scope.temp.dropOff.addressName,
                                travelMode: google.maps.DirectionsTravelMode.DRIVING
                            };
                            if ($scope.temp.pickUp.addressName && $scope.temp.dropOff.addressName) {
                                directionsService.route(request, function (result, status) {
                                    if (status === google.maps.DirectionsStatus.OK) {
                                        $scope.distance.distance = result.routes[0].legs[0].distance.value;
                                        directionsDisplay.setDirections(result);
                                        if($scope.temp.dropOff && $scope.temp.pickUp){
                                            $scope.getCarPrice();
                                        }
                                    }
                                });

                            }
                        }
                        else {
                            console.dir(status);
                            console.dir(results);

                        }
                        console.dir($scope.temp);
                    });


                }
            };
            $scope.getDirections = function () {
                var request = {
                    origin: $scope.temp.pickUp.addressName,
                    destination: $scope.temp.dropOff.addressName,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                directionsService.route(request, function (result, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        $scope.distance.distance = result.routes[0].legs[0].distance.value / 1000;
                        directionsDisplay.setDirections(result);
                        console.dir($scope.distance);
                    }
                });

            };
            $scope.getCarPrice = function () {
                var i;
                $http.defaults.headers.common['Authorization'] = 'Basic ' + key;
                $http.get('https://api-test.insoftd.com/v1/client/car_type').then(
                    function (obj) {
                        for (i = 0; i < obj.data.records.length; i++) {
                            $scope.data[i] = obj.data.records[i];
                            $scope.cars[i] = {
                                type: $scope.data[i].type,
                                id_type: $scope.data[i].id_type,
                                seats: $scope.data[i].seats_number
                            }
                        }

                    }
                    , function () {
                        console.dir('error');
                    });


                var car = $filter('filter')($scope.car);
                var passengersNumber = $filter('filter')($scope.passengersNumber);
                $scope.car = car;
                $scope.passengersNumber = passengersNumber;
                $scope.newcars = {};
                var j = 0;
                for (i = 0; i < $scope.data.length; i++) {
                    if (Number(passengersNumber) <= Number($scope.cars[i].seats)) {
                        $scope.newcars[j] = {
                            type: $scope.cars[i].type,
                            id_type: $scope.cars[i].id_type,
                            seats: $scope.cars[i].seats
                        };

                        j += 1;

                    }
                }
                if (car) {
                    var data = {
                        "priceList": [{
                            "RouteInfo": {
                                "legs": [2522],
                                "duration": 377,
                                "distance": $scope.distance.distance,
                                "points_list": [{
                                    "type": "p",
                                    "address": $scope.temp.pickUp.addressName,
                                    "lat": $scope.temp.pickUp.lat,
                                    "lng": $scope.temp.pickUp.lng
                                }, {
                                    "type": "d",
                                    "address": $scope.temp.dropOff.addressName,
                                    "lat": $scope.temp.dropOff.lat,
                                    "lng": $scope.temp.dropOff.lng
                                }]
                            },
                            "Booking": {
                                "id_car_type": $scope.car,
                                "infant_seats_number": 0,
                                "child_seats_number": 0,
                                "booster_seats_number": 0,
                                "id_client": null,
                                "pickup_time": "2017-09-23 14:04:24",
                                "passengers_number": $scope.passengersNumber,
                                "payment_method": $scope.paymentsMethod,
                                "waiting_time": 0,
                                "voucher_code": $scope.voucherCode ? $scope.voucherCode : null
                            }

                        }]
                    };

                    $http.defaults.headers.common['Authorization'] = 'Basic ' + key;
                    var url = 'https://api-test.insoftd.com/v1/client/price';
                    var voucherItem = '';
                    $http.post(url, data).then(
                        function (obj) {
                            console.dir(obj);
                            if (obj && obj.data && obj.data.records && obj.data.records) {
                                $scope.distance.price = obj.data.records.total_price;
                                $scope.booking_charge = obj.data.records[0].BookingCharge;
                                if ($scope.voucherCode) {
                                    $scope.distance.price = $scope.distance.price - 5;
                                    obj.data.records.total_price = $scope.distance.price;
                                }
                            }


                        }
                        , function () {
                            console.dir("error");
                        }
                    );
                }
            };
            $scope.sendData = function () {
                var data = {
                    "BookingList": [{
                        "Booking": {
                            "id_car_type": $scope.car,
                            "id_client": "1",
                            "order_number": "",
                            "id_driver_to_car": null,
                            "passenger_name": $scope.fullName,
                            "passenger_email": $scope.email,
                            "passenger_mobile": $scope.phoneNumber,
                            "payment_method": $scope.paymentsMethod,
                            "status": "Unallocated",
                            "source": "backoffice",
                            "infant_seats_number": 0,
                            "child_seats_number": 0,
                            "booster_seats_number": 0,
                            "passengers_number": $scope.passengersNumber,
                            "pickup_address": $scope.temp.pickUp.addressName,
                            "dropoff_address": $scope.temp.dropOff.addressName,
                            "pickup_time": "2017-09-14 15:14:00",
                            "pickup_lat": $scope.temp.pickUp.lat,
                            "pickup_lng": $scope.temp.pickUp.lng,
                            "dropoff_lat": $scope.temp.dropOff.lat,
                            "dropoff_lng": $scope.temp.dropOff.lng,
                            "duration": 1459,
                            "journey_distance": $scope.distance.distance,
                            "waiting_time": 0,
                            "journey_type": "asap",
                            "booking_type": 1,
                            "cancel_reason": null,
                            "id_pickup_zone": "791",
                            "id_dropoff_zone": "791",
                            "pickup_details": "",
                            "dropoff_details": ""
                        },
                        "BookingCharge": $scope.booking_charge,
                        "Payment": {
                            "payment_status": "Pending"
                        }
                    }]
                };
                var url = 'https://api-test.insoftd.com/v1/client/booking';
                var Key = $cookieStore.get('key');
                $http.defaults.headers.common['Authorization'] = 'Basic ' + Key;
                $http.post(url, data).then(
                    function (data) {
                        alert("Booking was inserted Successfully");
                        console.dir(data);
                        location.reload();
                    }
                    , function () {
                        alert("The booking could not be saved");
                        console.dir('error');
                    });
            };


            $scope.getConfigList = function () {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + key;
                var url = 'https://api-test.insoftd.com/v1/client/config';
                $http.get(url).then(
                    function (obj) {
                        var i = 0;
                        Object.keys(obj.data.records.paymentMethods).forEach(function (entry) {
                            $scope.paymentMethod[i] =
                                {
                                    name: obj.data.records.paymentMethods[entry].name
                                    , value: entry
                                };
                            i += 1;
                        });
                    }
                    , function () {
                        console.dir('error');
                    }
                );
                var paymentsMethod = $filter('filter')($scope.paymentsMethod);
            };


            var getCarPriceRefresh = $interval(function () {
            }, 100);
            $timeout(function () {
                $scope.getCarPrice();
            }, 50);
            $timeout(function () {
                $scope.getConfigList();
            }, 50);
            $timeout(function () {
                $scope.setLocation();
            }, 50);
            $timeout(function () {
                initMap();
            }, 50)
        }
        else
        {
            window.location='/#/';
            alert('You must log in first.')
        }
    });

scotchApp.controller('ProfileController',
    function($scope,$http, $cookieStore,$location) {
        if($cookieStore.get('key')) {
            var i=$cookieStore.get('userdetails');
            $scope.userDetails = JSON.parse(i);
        }
        else {
            window.location='/#/';
            alert('You must log in first.')
        }
    });

scotchApp.controller('MyBookingsController',
    function($scope, $http, $cookieStore) {
        if($cookieStore.get('key')) {
            $scope.Bookings = [];
            $scope.type=[];
            var i,j;
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
                          function(obj2){

                              $scope.type=obj2.data.records;
                              console.dir($scope.type);
                              for(i=0;i<$scope.Bookings.length;i++) {
                                  for (j = 0; j < $scope.type.length; j++) {
                                      if ($scope.Bookings[i].id_car_type == $scope.type[j].id_type) {
                                          $scope.Bookings[i].id_car_type = $scope.type[j].type;
                                      }
                                  }
                              }
                          },
                            function(){
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

scotchApp.controller('NavBarController',
    function($scope,$location, $cookieStore){
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
        $scope.logoutfunction = function() {
            $cookieStore.remove('key');
            $cookieStore.remove('userDetails');
        }
    });
scotchApp.controller('LoginController',
    function($scope,$http,$cookieStore) {
        $scope.sendCredentials = function()
        {
            var e_mail=$scope.email;
            var pass=$scope.password;
            var data = e_mail + ':' + pass + '@|@' + '248';

            var dataencode = btoa(data);

            $http.defaults.headers.common['Authorization'] = 'Basic ' + dataencode;
            var url='https://api-test.insoftd.com/v1/client/login';

            $http.post(url,{
                email: $scope.email
                , password: $scope.password
                , api_key: '248'
            }).then(
                function(obj){
                    alert("User logged successfully");
                    console.dir(obj.data.records);
                    $cookieStore.put('key', dataencode);
                    var stringObj=JSON.stringify(obj.data.records.user_details);
                    $cookieStore.put('userdetails',stringObj);
                    window.location = '/#/newBooking'
                },
                function(){
                    alert("Bad credentials try again");
                    console.dir('error');
                }
            );

        };


    });

scotchApp.controller('EditController',
    function($scope,$http,$cookieStore){
        var changeFirstName = $scope.changeFirstName;
        var changeLastName = $scope.changeLastName;
        var changeMobileNumber = $scope.changeMobileNumber;
        var changeStreet = $scope.changeStreet;
        var changePostCode = $scope.changePostCode;
        var changeCity = $scope.changeCity;
        var changeEmail = $scope.changeEmail;
        var changeAlternativeMobile = $scope.changeAlternativeMobile;
        var i=$cookieStore.get('userdetails');
        $scope.userDetails=JSON.parse(i);

        $scope.changeDetails = function(){

            if($scope.changeFirstName){
                $scope.userDetails.firstname=$scope.changeFirstName;
            }
            else
            if($scope.changeLastName){
                $scope.userDetails.lastname=$scope.changeLastName;
            }
            else
            if($scope.changeMobileNumber){
                $scope.userDetails.mobile_number=$scope.changeMobileNumber;
            }
            else
            if($scope.changeStreet){
                $scope.userDetails.street=$scope.changeStreet;
            }
            else
            if($scope.changePostCode){
                $scope.userDetails.postcode=$scope.changePostCode;
            }
            else
            if($scope.changeCity){
                $scope.userDetails.city=$scope.changeCity;
            }
            else
            if($scope.changeEmail){
                $scope.userDetails.email=$scope.changeEmail;
            }
            else
            if($scope.changeAlternativeMobile){
                $scope.userDetails.alternativemobile=$scope.changeAlternativeMobile;
            }
            console.dir($scope.userDetails);
            var stringObj=JSON.stringify($scope.userDetails);
            $cookieStore.put('userdetails',stringObj);
            var url='https://api-test.insoftd.com/v1/client/login';
            var Key=$cookieStore.get('key');
            $http.defaults.headers.common['Authorization'] = 'Basic '+ Key;
            $http.post(url,{
                email: "popovici.tudor@yahoo.com"
                , password: "asdasdasd"
                , api_key: '248'
            }).then(
                function(obj) {
                    obj.data.records.user_details=$scope.userDetails;
                    console.dir(obj.data.records);

                },
                function(){
                    console.dir('error')
                });

            window.location = '/#/myProfile';

        }

    });

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
            console.dir(data.Booking.constructor.name);
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

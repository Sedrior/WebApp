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

                    ;
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

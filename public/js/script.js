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



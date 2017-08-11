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

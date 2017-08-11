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



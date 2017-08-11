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
            var url='https://api-test.insoftd.com/v1/operator/login';
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

angular.module('wtfsidn', [])

// .factory('getLocation', function() {

//   var latitude;
//   var longitude;

//   navigator.geolocation.getCurrentPosition(function(position) {
//     latitude = position.coords.latitude;
//     longitude = position.coords.longitude;
//     console.log('navigator.geolocation');
//   });

//   return {
//     latitude: latitude,
//     longitude: longitude
//   };

// })


.factory("GeolocationService", function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
})

.controller('MainCtrl', function ($scope, GeolocationService) {
    $scope.position = null;
    $scope.message = "Determining gelocation...";

    GeolocationService().then(function (position) {
        $scope.position = position;
    }, function (reason) {
        $scope.message = "Could not be determined."
    });
})

// .controller('getLocationController', function($scope) {

//   $scope.test = "GETTING LOCATION!!";

//   $scope.latitude = "nothing yet";

//   $scope.longitude = "nothing yet";

//   $scope.getLocation = function() {

//     navigator.geolocation.getCurrentPosition().then(function(position) {
//       $scope.latitude = position.coords.latitude;
//       console.log('position lat', position.coords.latitude);
//       console.log('$scope.lat inside', $scope.latitude);
//       $scope.longitude = position.coords.longitude;
//       console.log('position long', position.coords.longitude);
//       console.log('$scope.long outside', $scope.longitude);
//     });
    
//   }; 

// })

// .controller('mainController', function($scope) {
//   $scope.test = 'howdy';
// })

;
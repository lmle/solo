angular.module('wtfsidn', [])

.factory("GeolocationService", function($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function(error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
})

.factory('YelpDataService', function($http) {

  var getYelpData = function() {
    return $http({
      method: 'GET',
      url: 'http://127.0.0.1:8080/',
      data: { whatintheworld: 'what' }
    });
  };

  return {
    getYelpData: getYelpData
  };

})

.controller('MainController', function($scope, GeolocationService, YelpDataService) {
    $scope.position = null;

    $scope.longitude = null;
    $scope.latitude = null;

    $scope.message = "Determining gelocation...";

    GeolocationService().then(function (position) {
      $scope.position = position;
      $scope.longitude = position.coords.longitude;
      $scope.latitude = position.coords.latitude;
    }, function (reason) {
      $scope.message = "Could not be determined."
    });

    YelpDataService.getYelpData()
      .then(function(data) {
        console.log('data from YelpDataService', data);
      });

})

;
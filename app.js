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

  var getYelpData = function(city) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:8080/',
      data: 'city='+city,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  return {
    getYelpData: getYelpData
  };

})

.controller('MainController', function($scope, GeolocationService, YelpDataService) {

    var yelpData;
    $scope.city;
    $scope.suggestion = null;

    var randomNumber = function(length) {
      return Math.floor(Math.random() * length);
    };

    $scope.getYelpData = function() {
      YelpDataService.getYelpData($scope.city)
        .then(function(data) {

          yelpData = data.data;

          $scope.generateSuggestion();

        });
    };

    $scope.generateSuggestion = function() {
      var suggestion = yelpData[randomNumber(yelpData.length)];

      $scope.suggestion = suggestion;
    };


    // $scope.position = null;

    // $scope.longitude = null;
    // $scope.latitude = null;

    // $scope.message = "Determining gelocation...";

    // GeolocationService().then(function (position) {
    //   $scope.position = position;
    //   $scope.longitude = position.coords.longitude;
    //   $scope.latitude = position.coords.latitude;

    //   YelpDataService.getYelpData($scope.longitude, $scope.latitude)
    //     .then(function(data) {
    //       console.log('data from YelpDataService', data);
    //     });

    // }, function (reason) {
    //   $scope.message = "Could not be determined."
    // });

})

;
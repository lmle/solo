var map;

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

  var getYelpData = function(userLocation) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:8080/',
      data: 'userLocation='+userLocation,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  return {
    getYelpData: getYelpData
  };

})

.controller('MainController', function($scope, GeolocationService, YelpDataService) {

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    // var map;

    var initialize = function(lat, lng) {
      directionsDisplay = new google.maps.DirectionsRenderer();
      var start = new google.maps.LatLng(0,0);
      var mapOptions = {
        zoom: 7,
        center: start
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      directionsDisplay.setMap(map);
      // google.maps.event.trigger(map, 'resize');
    }

    var calcRoute = function(start, end){
      var request = {
          origin:start,
          destination:end,
          travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.resize = function() {
       var center = map.getCenter();
       google.maps.event.trigger(map, "resize");
       map.setCenter(center); 
    };

    // google.maps.event.addDomListener(window, 'resize', function() {
    //  var center = map.getCenter();
    //  google.maps.event.trigger(map, "resize");
    //  map.setCenter(center); 
    // });

    var yelpData;
    $scope.userLocation;
    $scope.suggestion = null;
    $scope.suggestionAddress = null;

    var randomNumber = function(length) {
      return Math.floor(Math.random() * length);
    };

    $scope.getYelpData = function() {
      YelpDataService.getYelpData($scope.userLocation)
        .then(function(data) {

          yelpData = data.data;

          $scope.generateSuggestion();

        });
    };

    $scope.generateSuggestion = function() {
      $scope.suggestion = yelpData[randomNumber(yelpData.length)];
      $scope.suggestionAddress = $scope.suggestion.location.display_address.join(' ');
      
      console.log('display_address:', $scope.suggestionAddress);

      calcRoute($scope.userLocation, $scope.suggestionAddress);
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
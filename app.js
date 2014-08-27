// $(function() {
//   $('span.title').css('background-color', 'red');
// });

var placeSearch, autocomplete;

var addressInitialize = function() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      { types: ['geocode'] });
};

angular.module('wtfsidn', [])

.factory('YelpDataService', function($http) {

  var getYelpData = function(userLocation) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:8080/',
      data: 'userLocation='+userLocation,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      // headers: {'Content-Type': 'application/json'}
    });
  };

  return {
    getYelpData: getYelpData
  };

})

.controller('MainController', function($scope, YelpDataService) {


  // Google Directions    
  var map;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  var resize = function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
  };

  var mapInitialize = function(lat, lng) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var start = new google.maps.LatLng(0,0);
    var mapOptions = {
      zoom: 7,
      center: start
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    google.maps.event.addListener(map, 'mouseover', resize);
  };

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
  };

  google.maps.event.addDomListener(window, 'load', mapInitialize);

  var yelpData;
  $scope.suggestion = null;
  $scope.suggestionAddress = null;

  var randomNumber = function(length) {
    return Math.floor(Math.random() * length);
  };

  $scope.getYelpData = function() {
    YelpDataService.getYelpData(document.getElementById('autocomplete').value)
      .then(function(data) {

        yelpData = data.data;

        $scope.generateSuggestion();

      });
  };

  $scope.generateSuggestion = function() {
    $scope.suggestion = yelpData[randomNumber(yelpData.length)];
    $scope.suggestionAddress = $scope.suggestion.location.display_address.join(' ');
    
    console.log('display_address:', $scope.suggestionAddress);

    calcRoute(document.getElementById('autocomplete').value, $scope.suggestionAddress);
  };

})

;
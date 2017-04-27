var myApp = angular.module('myApp',[]);

myApp.controller('pubCtrl', ['$scope', '$http', function ($scope, $http) {
  //$http.get('http://ltweb.ceoas.oregonstate.edu/lab_site_dev/resources/data/people.json')
  $http.get('resources/data/publications.json')
  .success(function (data, status, headers, config) {
	$scope.pubs = data;
	  console.log(data)
  })
  .error(function (data, status, headers, config) {
    console.log("dang it! get people is broke!")
  });
}]);
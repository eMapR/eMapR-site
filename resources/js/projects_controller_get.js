var myApp = angular.module('myApp',[]);

myApp.controller('projCtrl', ['$scope', '$http', function ($scope, $http) {
  //$http.get('http://ltweb.ceoas.oregonstate.edu/lab_site_dev/resources/data/people.json')
  $http.get('resources/data/projects.json')
  .success(function (data, status, headers, config) {
	$scope.projects = data;
	  console.log(data)
  })
  .error(function (data, status, headers, config) {
    console.log("dang it! get projects is broken!")
  });
}]);
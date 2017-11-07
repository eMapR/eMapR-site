var myApp = angular.module('myApp',[]);

myApp.controller('peopleCtrl', ['$scope', '$http', function ($scope, $http, $sce) {
  //$http.get('http://ltweb.ceoas.oregonstate.edu/lab_site_dev/resources/data/people.json')
  $scope.$sce = $sce;
  $http.get('resources/data/people.json')
  .success(function (data, status, headers, config) {
	$scope.people = data;
  })
  .error(function (data, status, headers, config) {
    console.log("dang it! get people is broke!")
  });
}]);
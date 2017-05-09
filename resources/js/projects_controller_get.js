var myApp = angular.module('myApp',[]);

myApp.controller('projCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
  //$http.get('http://ltweb.ceoas.oregonstate.edu/lab_site_dev/resources/data/people.json')
  $scope.$sce = $sce;
  $http.get('resources/data/projects.json')
  .success(function (data, status, headers, config) {
	$scope.projects = data;
	  //console.log(data)
            
    $(function() {
      //console.log("adjusting height!")
      $('.box').matchHeight();
    });
  })
  .error(function (data, status, headers, config) {
    console.log("projects_controller_get.js is broken!")
  });
}]);
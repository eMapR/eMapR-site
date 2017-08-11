var myApp = angular.module('myApp',[]);

myApp.controller('projCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
  $scope.$sce = $sce;
  $http.get('resources/data/tools.json')
  .success(function (data, status, headers, config) {
	$scope.projects = data;
            
    $(function() {
      $('.box').matchHeight();
    });
  })
  .error(function (data, status, headers, config) {
    console.log("tools_controller_get.js is broken!")
  });
}]);
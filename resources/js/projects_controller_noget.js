var myApp = angular.module('myApp',[]);

myApp.controller('projCtrl', ['$scope', function ($scope) {

	$scope.projects = ["dog", "cat", "lizard", "horse","sheep"]

}]);
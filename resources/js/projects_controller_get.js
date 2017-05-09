var myApp = angular.module('myApp',[]);

myApp.controller('projCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
  //$http.get('http://ltweb.ceoas.oregonstate.edu/lab_site_dev/resources/data/people.json')
  $scope.$sce = $sce;
  $http.get('resources/data/projects.json')
  .success(function (data, status, headers, config) {
	$scope.projects = data;
	  console.log(data)
            
      $(function() {
        console.log("I'm in!")
        $('.box').matchHeight();
      });
      
      
            //$( window ).on( "load", function() { $.fn.matchHeight._update() })
            //console.log('updated') 
  })
  .error(function (data, status, headers, config) {
    console.log("dang it! get projects is broken!")
  });
}]);
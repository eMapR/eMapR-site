var myApp = angular.module('myApp',[]);

myApp.controller('peapleCtrl', ['$scope', function ($scope) {

  // create a emails Object
  $scope.people = {};

  // pretend data we just got back from the server
  // this is an ARRAY of OBJECTS
  $scope.people.current = [
	  {
		"name": "Robert Kennedy",
		"position": "Princple Investigator",
		"img": "/",
		"bio": "Robert has no idea what is happening on landscapes, and thus spends all of his time trying to figure it out. So far, he has been using remote sensing, stats, and various geospatial analyses to do so, but he is always open to new ideas.  Outside of work he and his family have been setting records for number of full-household-moves per annum, but they are finally settling down long enough to do lots of yardwork and painting."
	  },
	  {
		"name": "Joe Hughes",
		"position": "Post Doc",
		"img": "/",
		"bio": "Joe is an ecologist and data scientist who uses satellite imagery, fancy computers, and statistical learning to try and understand landscape change processes. Along the way he’s distracted by incorporating and quantifying uncertainty arising from multiple sources, most recently focusing on imperfect human-operator-defined ‘truth’. Joe collects hobbies and fills his time creek stomping and botanizing in forests, brewing various potent drinks, and tending to his new bee hives."
	  },
	  {
		"name": "Sam Hooper",
		"position": "Faculty Research Assistant",
		"img": "/",
		"bio": "Sam has always been fascinated by the intersection of art, science, philosophy, and the biophysical environment. He has lead parallel careers as both a practicing artist and a backcountry ranger for Denali National Park in Alaska. Sam graduated from the Pennsylvania Academy of Fine Art’s sculpture program, and he received a BFA from the University of Pennsylvania. During his tenure with the Park Service, his medium for exploring the world shifted from charcoal and bronze to geographic information science. When he’s not hunched over his laptop, Sam tries to spend as much time as possible outside hiking, paddling, climbing, or skiing."
	  },
	  {
		"name": "Pedar Nelson",
		"position": "Faculty Research Assistant",
		"img": "/",
		"bio": "Pedar's bio"
	  },
	  {
		"name": "Dan Stephen",
		"position": "Faculty Research Assistant",
		"img": "/",
		"bio": "Dan's bio"
	  },
	  {
		"name": "Tyler Harris",
		"position": "Master's Student",
		"img": "/",
		"bio": "Tyler's bio"
	  },
	  {
		"name": "Justin Braaten",
		"position": "Faculty Research Assistant",
		"img": "/",
		"bio": "Justin's bio"
	  }
  ];

}]);
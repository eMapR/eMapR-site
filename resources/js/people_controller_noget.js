var myApp = angular.module('myApp',[]);

myApp.controller('peopleCtrl', ['$scope', function ($scope) {

  $scope.people = {
	"student": [{
		"name": "Tyler Harris",
		"position": "Master's Student",
		"img": "resources/images/people/people_no_photo.jpg",
		"bio": "Tyler's bio"
	}, {
		"name": "Jane Darbyshire",
		"position": "PhD Student",
		"img": "resources/images/people/people_no_photo.jpg",
		"bio": "Jane's bio"
	}, {
		"name": "Paulo Murillo-Sandoval",
		"position": "? Student",
		"img": "resources/images/people/people_no_photo.jpg",
		"bio": "Paulo's bio"
	}],
	"faculty": [{
		"name": "Justin Braaten",
		"position": "Faculty Research Assistant",
		"img": "resources/images/people/people_braatenj.jpg",
		"bio": "Justin's bio"
	}, {
		"name": "Sam Hooper",
		"position": "Faculty Research Assistant",
		"img": "resources/images/people/people_hoopers.jpg",
		"bio": "Sam has always been fascinated by the intersection of art, science, philosophy, and the biophysical environment. He has lead parallel careers as both a practicing artist and a backcountry ranger for Denali National Park in Alaska. Sam graduated from the Pennsylvania Academy of Fine Art’s sculpture program, and he received a BFA from the University of Pennsylvania. During his tenure with the Park Service, his medium for exploring the world shifted from charcoal and bronze to geographic information science. When he’s not hunched over his laptop, Sam tries to spend as much time as possible outside hiking, paddling, climbing, or skiing."
	}, {
		"name": "Pedar Nelson",
		"position": "Faculty Research Assistant",
		"img": "resources/images/people/people_no_photo.jpg",
		"bio": "Pedar's bio"
	}, {
		"name": "Dan Stephen",
		"position": "Faculty Research Assistant",
		"img": "resources/images/people/people_no_photo.jpg",
		"bio": "Dan's bio"
	}, {
		"name": "Joe Hughes",
		"position": "Post Doc",
		"img": "resources/images/people/people_hughesj.jpg",
		"bio": "Joe is an ecologist and data scientist who uses satellite imagery, fancy computers, and statistical learning to try and understand landscape change processes. Along the way he’s distracted by incorporating and quantifying uncertainty arising from multiple sources, most recently focusing on imperfect human-operator-defined ‘truth’. Joe collects hobbies and fills his time creek stomping and botanizing in forests, brewing various potent drinks, and tending to his new bee hives."
	}, {
		"name": "Robert Kennedy",
		"position": "Principal  Investigator",
		"img": "resources/images/people/people_kennedyr.jpg",
		"bio": "Robert has no idea what is happening on landscapes, and thus spends all of his time trying to figure it out. So far, he has been using remote sensing, stats, and various geospatial analyses to do so, but he is always open to new ideas.  Outside of work he and his family have been setting records for number of full-household-moves per annum, but they are finally settling down long enough to do lots of yardwork and painting."
	}],
	"affiliate": [],
	"alumni": [{
		"name": "Tara Larrue",
		"position": "Faculty Research Assistant",
		"img": "resources/images/people/people_larruet.jpg",
		"bio": "Tara recently graduated from Northeastern University in Boston with a BS in Environmental Science and a minor in Information Science. She is interested in using data modeling and visualization to understand environmental problems. Before working with LandTrendr, she completed contract jobs with EnerNOC, Stanford University, and NASA, and managed to travel to several foreign countries. When she’s not daydreaming about her next adventure, Tara loves cooking, biking, and yoga."
	}]
}
}]);
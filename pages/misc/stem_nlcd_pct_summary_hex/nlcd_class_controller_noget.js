var myApp = angular.module('myApp',[]);

myApp.controller('nlcdClassCtrl', ['$scope', function ($scope) {

	$scope.nlcdClasses = [
		{
			"name": "Open Water",
			"src": "vids/pct_equal_11_30km_clipped.mp4"
		},
		{
			"name": "Perennial Ice/Snow",
			"src": "vids/pct_equal_12_30km_clipped.mp4"
		},
		{
			"name": "Developed",
			"src": "vids/pct_equal_22_23_24_30km_clipped.mp4"
		},
		{
			"name": "Developed, Low Intensity",
			"src": "vids/pct_equal_22_30km_clipped.mp4"
		},
		{
			"name": "Developed, Medium & High Intensity",
			"src": "vids/pct_equal_23_24_30km_clipped.mp4"
		},
		{
			"name": "Developed, Medium Intensity",
			"src": "vids/pct_equal_23_30km_clipped.mp4"
		},
		{
			"name": "Developed High Intensity",
			"src": "vids/pct_equal_24_30km_clipped.mp4"
		},
		{
			"name": "Barren Land (Rock/Sand/Clay)",
			"src": "vids/pct_equal_31_30km_clipped.mp4"
		},
		{
			"name": "Deciduous Forest",
			"src": "vids/pct_equal_41_30km_clipped.mp4"
		},
		{
			"name": "Evergreen Forest",
			"src": "vids/pct_equal_42_30km_clipped.mp4"
		},
		{
			"name": "Mixed Forest",
			"src": "vids/pct_equal_43_30km_clipped.mp4"
		},
		{
			"name": "Shrub/Scrub",
			"src": "vids/pct_equal_52_30km_clipped.mp4"
		},
		{
			"name": "Grassland/Herbaceous",
			"src": "vids/pct_equal_71_30km_clipped.mp4"
		},
		{
			"name": "Pasture/Hay",
			"src": "vids/pct_equal_81_30km_clipped.mp4"
		},
		{
			"name": "Cultivated Crops",
			"src": "vids/pct_equal_82_30km_clipped.mp4"
		},
		{
			"name": "Woody Wetlands",
			"src": "vids/pct_equal_90_30km_clipped.mp4"
		},
		{
			"name": "Emergent Herbaceous Wetlands",
			"src": "vids/pct_equal_95_30km_clipped.mp4"
		}
	]
}]);
app.controller('plotCtrl', ['$scope', 'APService', 'APSelectorService',
	'cordovaService', function($scope, APService, APSelectorService, cordovaService) {
		cordovaService.ready.then (
			function resolved() {
				$scope.labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
          "11", "12", "13", "14", "15", "16", "17", "18", "19"];
  			$scope.series = ['NETGEAR', 'UCSD-PROTECTED', 'UCSD-GUEST', 'RESNET-SIXTH', 'TX-GUEST', 'AIRSCOUT-AE039'];
  			$scope.data = [
    			[81, 35, 86, 81],
    			[48, 37, 16, 57, 66, 35, 33, 47, 59, 28, 81, 70, 33, 1, 4, 60, 8, 21, 43],
          [33, 10, 50, 7, 55, 26, 37, 51, 60, 61, 86, 79, 66, 78, 5, 57, 31, 36, 55],
          [43, 59, 3, 60, 90, 76, 71, 27, 81, 77, 89, 44, 4, 13, 6, 46, 34, 61, 68],
          [8, 15, 12, 88, 15, 6, 87, 88, 15, 25, 20, 74, 43, 16, 67, 79, 33, 84, 10],
          [18, 85, 76, 71, 10, 32, 15, 69, 26, 13, 37, 63, 39, 79, 52, 1, 31, 39, 16]
  			];
				$scope.colors = [
					'#97BBCD',
					'#97BBCD',
					'#F7464A',
					'#97BBCD',
					'#F7464A',
					'#FDB45C'
				];

        $scope.updateData = function() {
          $scope.data =  [
            [35, 86, 81, 12, 1, 82, 4, 42, 69, 36, 16, 13, 88, 67, 56, 26, 70, 35, 7],
            [37, 16, 57, 66, 35, 33, 47, 59, 28, 81, 70, 33, 1, 4, 60, 8, 21, 43, 56],
            [10, 50, 7, 55, 26, 37, 51, 60, 61, 86, 79, 66, 78, 5, 57, 31, 36, 55, 16],
            [59, 3, 60, 90, 76, 71, 27, 81, 77, 89, 44, 4, 13, 6, 46, 34, 61, 68, 76],
            [15, 12, 88, 15, 6, 87, 88, 15, 25, 20, 74, 43, 16, 67, 79, 33, 84, 10, 37],
            [85, 76, 71, 10, 32, 15, 69, 26, 13, 37, 63, 39, 79, 52, 1, 31, 39, 16, 6]
          ];
        }

  			$scope.onClick = function (points, evt) {
    			console.log(points, evt);
  			};
			},
      function rejected() {
        console.log("plotCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
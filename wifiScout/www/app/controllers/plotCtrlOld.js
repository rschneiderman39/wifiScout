app.controller('plotCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
	'plotDataService', 'cordovaService', function($scope, $timeout, APService,
	APSelectorService, plotDataService, cordovaService) {
		cordovaService.ready.then (
			function resolved() {

				$scope.datasets = undefined;

  			var _ctx,
						_plot,
						_update = true;

				var _updatePlot = function(datasets) {
					/* Ensure the plot doesn't try to re-render when we are in another view */
					if (_update) {
						plotDataService.requestDatasets().done(_updatePlot);
						$scope.$apply(function() {
								$scope.datasets = datasets;
						});
						var before = (new Date()).getTime(),
						    data = {
									labels: plotDataService.getLabels(),
									datasets: datasets
								};
						/* re-render the plot */
						_plot = new Chart(_ctx).Line(data, plotDataService.getOptions());
						var renderTime = (new Date()).getTime() - before;
						console.log(renderTime);
						/* If the plot is rendering too slowly, decrease the
						   granularity of the data */
						if (renderTime >= plotDataService.getInterval()) {
							plotDataService.increasePerformance();
						} else if (renderTime < plotDataService.getInterval() * .2) {
							plotDataService.increaseGranularity();
						}
					}
				};

				/* INIT */

				$scope.$on('$destroy', function() {
					_update = false;
				});

				/* Initialize the plot */
				var data = plotDataService.getInitDatasets();
				_ctx = $("#line").get(0).getContext("2d");
				_plot = new Chart(_ctx).Line(
					{
						labels: plotDataService.getLabels(),
						datasets: data
					},
					plotDataService.getOptions()
				);
				/* Update the plot with the next dataset as soon as it's available */
				plotDataService.requestDatasets().done(_updatePlot);
			},
      function rejected() {
        console.log("plotCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
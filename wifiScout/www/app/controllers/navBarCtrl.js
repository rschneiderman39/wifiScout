app.controller('navBarCtrl', ['$scope', '$location', 'cordovaService',
  function($scope, $location, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.highlight = function(id) {
          var old_selected = $('#' + _selected)[0],
              new_selected = $('#' + id)[0];

          old_selected.src = old_selected.src.replace("-selected", "");
          new_selected.src = new_selected.src.replace(".png", "-selected.png");

          _selected = id;
        }

        var _selected = 'settings-img';
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    );
}]);

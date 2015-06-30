app.controller('modalCtrl', ['$scope', 'APService', 'settingsService',
                             'filterService', 'cordovaService',
  function($scope, APService, settingsService, filterService, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        // Settings for this session
        $scope.modal = {
          allAPs: [],             // Every AP we know about
          selectedAPs: [],        // The set of selected APs
          selector: 'SSID',       // Determines how APs are listed
          buttonText: 'List by MAC',
        };

        var view = undefined;

        // Toggle between listing APs by SSID and by MAC
        var _toggleSelector = function() {
          if ($scope.modal.selector === 'SSID') {
            $scope.modal.buttonText = 'List by SSID';
            $scope.modal.selector = 'BSSID';
          } else {
            $scope.modal.buttonText = 'List by MAC';
            $scope.modal.selector = 'SSID';
          }
        };

        // Select all APs, and show any new AP that later becomes visible
        var _showAll = function() {
          settingsService[_view].setShowAll(true);
          settingsService[_view].setSelectedBSSIDs([]);
          $scope.modal.selectedAPs = $scope.modal.allAPs.slice();
        }

        // Unselect all APs
        var _hideAll = function() {
          settingsService[_view].setShowAll(false);
          settingsService[_view].setSelectedBSSIDs([]);
          $scope.modal.selectedAPs = [];
        }

        // Initialize the modal with the settings used previously
        var _init = function() {
          settingsService[_view].getSettingsImmediate().done(
            function(settings) {
              $scope.modal.allAPs = APService.getNamedAPs();
              if (settings.showAll) {
                $scope.modal.selectedAPs = $scope.modal.allAPs.slice();
              } else {
                $scope.modal.selectedAPs = filterService.filter(
                  $scope.modal.allAPs,
                  settings.selectedBSSIDs
                );
              }
            }
          )
        };

        // Update the settings service with our new selection
        var _pushSelection = function() {
          settingsService[_view].setSelectedBSSIDs($scope.modal.selectedAPs.map(
            function(ap) {return ap.BSSID; }
          ));
        };

        // Set up button and checkbox event handlers
        $('#modal').on('show.bs.modal', _init);
        $('#modalList').on('click', _pushSelection);
        $('#btnShow').on('click', _showAll);
        $('#btnHide').on('click', _hideAll);

        // Determine the view from the hidden viewTitle DOM element
        var _setView = function() {
          _view = $('#viewTitle').attr('ng-class');
        }

        // This is needed because of the late binding of the ng-class attribute
        setTimeout(_setView, 0);
      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);

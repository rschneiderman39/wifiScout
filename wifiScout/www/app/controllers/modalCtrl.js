app.controller('modalCtrl', ['$scope', 'APService', 'filterSettingsService',
                             'cordovaService',
  function($scope, APService, filterSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        $scope.allAPData = [];

        $scope.toggleSelected = function(AP) {
          isSelected[AP.BSSID] = isSelected[AP.BSSID] ? false : true;
          pushSelection();
        };

        $scope.isSelected = function(AP) {
          return isSelected[AP.BSSID];
        };

        var view = undefined,
            isSelected = {};

        // Select all APs, and show any new AP that later becomes visible
        var selectAll = function() {
          filterSettingsService.setShowAll(view, true);
          $scope.$apply(function() {
            for (var i = 0; i < $scope.allAPData.length; ++i) {
              isSelected[$scope.allAPData[i].BSSID] = true;
            }
          });
        };

        var unselectAll = function() {
          filterSettingsService.setShowAll(view, false);
          filterSettingsService.setSelectedBSSIDs(view, []);
          $scope.$apply(function() { isSelected = {}; });
        };

        // Initialize the modal with the settings used previously
        var init = function() {
          console.log(view);
          var settings = filterSettingsService.getSettings(view);
          $scope.$apply(function() {
            $scope.allAPData = APService.getNamedAPData();
            if (settings.showAll) {
              for (var i = 0; i < $scope.allAPData.length; ++i) {
                isSelected[$scope.allAPData[i].BSSID] = true;
              }
            } else {
              for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
                isSelected[settings.selectedBSSIDs[i]] = true;
              }
            }
          });
        };

        var pushSelection = function() {
          var selection = [];
          for (var BSSID in isSelected) {
            if (isSelected[BSSID]) selection.push(BSSID);
          }
          filterSettingsService.setShowAll(view, false);
          filterSettingsService.setSelectedBSSIDs(view, selection);
        };

        // Set up button and checkbox event handlers
        $('#filterModal').on('show.bs.modal', init);
        $('#btnShow').on('click', selectAll);
        $('#btnHide').on('click', unselectAll);

        //Determine the view from the hidden viewTitle DOM element.
        var setView = function() {
          console.log('setting view');
          view = $('#viewTitle').attr('ng-class');
          console.log(view);
        };

        // This is needed because of the late binding of the ng-class attribute
        setTimeout(setView, 0);
      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);

app.controller('navCtrl', ['$scope', '$state', '$timeout', 'cordovaService',
  function($scope, $state, $timeout, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.showNav = function() {
          clearTimeout(navTimeout);
          var navBar = $('#bottomBar');
          navBar.css('bottom', '-15px');
          navTimeout = setTimeout(function() {
            navBar.css('bottom', '-98px');
          }, NAV_SHOW_INTERVAL);
        };

        $scope.setActive = function(view) {
          var titleText;
          switch (view) {
            case "channelGraph":
              titleText = "Channel Graph";
              break;
            case "signalStrength":
              titleText = "Signal Strength";
              break;
            case "timeGraph":
              titleText = "Time Graph";
              break;
            case "APTable":
              titleText = "AP Table";
              break;
            case "channelTable":
              titleText = "Channel Table";
              break;
            case "settings":
              titleText = "Settings";
              break;
            default:
              titleText = "";
          }
          document.getElementById('greenTitle').innerHTML = titleText;
          var oldHighlightedImg = $('#' + activeView + "-img")[0],
              newHighlightedImg = $('#' + view + "-img")[0];

          oldHighlightedImg.src = oldHighlightedImg.src.replace("-selected", "");
          newHighlightedImg.src = newHighlightedImg.src.replace(".png", "-selected.png");

          activeView = view;
        };

        $scope.isActive = function(view) {
          return activeView === view;
        };

        $scope.usesFilterBtn = function() {
          return activeView === 'APTable' || activeView === 'timeGraph' || activeView === 'channelGraph';
        };

        $scope.swipeRight = function (view) {
          $state.go(view);
          $scope.setActive(view);
        };

        $scope.swipeLeft = function (view) {
          $state.go(view);
          $scope.setActive(view);
        };

        var activeView = "settings",
            navTimeout = null,
            NAV_SHOW_INTERVAL = 2000;

        $scope.setActive('settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }])

app.factory('channelChecker', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    var isAllowableChannel = {};

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

    var init = function() {
      isAllowableChannel = channels[constants.region] || channels[defaults.region];
    };

    init();

  });

  return service;

}]);

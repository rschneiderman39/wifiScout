"use strict";

app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphManager',
  'visBuilder', 'setupService', function($scope, $timeout, timeGraphManager,
  visBuilder, setupService) {

    setupService.ready.then(function() {

      var prefs = {
        domain: timeGraphManager.getDomain(),
        range: [constants.noSignal, constants.maxSignal],
        lineWidth: 2,
        highlightedLineWidth: 6,
        highlightOpacity: 0.3
      };

      var updateInterval = timeGraphManager.getUpdateInterval(),
          domain = timeGraphManager.getDomain();

      $scope.strings = strings;
      $scope.legendData = undefined;
      $scope.isDuplicateSSID = {};
      $scope.selectedSSID = null;
      $scope.selectedMacAddr = null;

      $scope.toggleSelected = function(legendItem) {
        if (legendItem.MAC === $scope.selectedMacAddr) {
          $scope.selectedMacAddr = null;
          $scope.selectedSSID = null;
        } else {
          $scope.selectedMacAddr = legendItem.MAC;
          $scope.selectedSSID = legendItem.SSID;
        }

        timeGraphManager.toggleHighlight(legendItem.MAC);
      };

      $scope.isSelected = function(legendItem) {
        return legendItem.MAC === $scope.selectedMacAddr;
      };

      function init() {
        var config = {
          graphDomain: prefs.domain,
          graphMargins: {
            top: 20,
            bottom: 25,
            left: 50,
            right: 10
          },
          gridLineOpacity: 0.5,
          height: undefined,
          labelX: strings.timeGraph.labelX,
          labelY: strings.timeGraph.labelY,
          navPercent: 0,
          range: prefs.range,
          width: undefined,
          xAxisTickInterval: 5,
          yAxisTickInterval: 10
        };

        config.width = $('#time-graph').width();
        config.height = ($(window).height() - $('#top-bar').height()) * 0.95;

        var vis = visBuilder.buildVis(config, elementUpdateFn, null,
          null, null, null);

        $scope.selectedSSID = timeGraphManager.getHighlightedSSID();
        $scope.selectedMacAddr = timeGraphManager.getHighlightedMacAddr();

        updateLegend();

        document.addEventListener(events.newTimeGraphData, vis.update);

        document.addEventListener(events.newLegendData, updateLegend);

        $scope.$on('$destroy', function() {
          document.removeEventListener(events.newTimeGraphData, vis.update);

          document.removeEventListener(events.newLegendData, updateLegend);

          d3.select('#vis').selectAll('*').remove();
        });

      };

      function updateDuplicateSSIDs() {
        var found = {},
            duplicates = {};

        $.each($scope.legendData, function(i, legendItem) {
          if (found[legendItem.SSID]) {
            duplicates[legendItem.SSID] = true;
          } else {
            found[legendItem.SSID] = true;
          }
        });

        $scope.isDuplicateSSID = duplicates;
      };

      function updateLegend() {
        $timeout(function() {
          $scope.legendData = timeGraphManager.getLegendData();

          updateDuplicateSSIDs();
        });
      };

      function elementUpdateFn(graphClip, graphScalesX, graphScalesY) {
        var lineGenerator = d3.svg.line()
          .x(function(d, i) {
            return graphScalesX(domain[0] + (i-2) * (updateInterval / 1000));
          })
          .y(function(d, i) {
            return graphScalesY(d.level);
          })
          .interpolate('linear');

        var datasets = timeGraphManager.getSelectedDatasets();

        var lines = graphClip.selectAll('.data-line')
          .data(datasets, function(d, i) {
            return d.MAC;
          });

        lines.interrupt();

        lines.exit()
          .remove();

        lines.enter()
          .append('path')
          .classed('data-line', true)
          .attr('stroke', function(d) { return d.color })
          .attr('stroke-width', prefs.lineWidth)
          .attr('fill', 'none');

        var translation = graphScalesX(updateInterval / 1000) - graphScalesX(0);

        lines
          .attr('fill', function(d) {
            if (d.highlight) {
              this.parentNode.appendChild(this);
              return utils.toNewAlpha(d.color, prefs.highlightOpacity);
            } else {
              return 'none';
            }
          })
          .attr('stroke-width', function(d) {
            if (d.highlight) {
              return prefs.highlightedLineWidth;
            } else {
              return prefs.lineWidth;
            }
          })
          .attr('d', function(d) {
            return lineGenerator(d.dataset);
          })
          .attr('transform', 'translate(' + translation + ')')
          .transition()
            .duration(updateInterval)
            .ease('linear')
            .attr('transform', 'translate(0)');

      };

      init();

    });

}]);

/* global $, _ */
(function() {
  var UnitCollection = window.UnitCollection;
  var UnitView = window.UnitView;
  var SummaryView = window.SummaryView;

  var App = {};

  App.start = function() {
    $.getJSON('../units.json', function(units) {
      App._log('Started');
      App.setup(units);
    });
  };

  App.setup = function(units) {
    units = new UnitCollection(units);

    var createUnit = function(options) {
      var view = new UnitView($(options.selector), options.model);
      view.render();
    };

    var unitCreations = units.map(function(unit) {
      return {
        selector: '#' + unit.get('id'),
        model: unit
      };
    });

    _.forEach(unitCreations, createUnit);

    var summaryView = new SummaryView($('#summary'), units);
    summaryView.render();
  };

  App._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'App:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.App = App;
}());

/* global $, _ */
(function() {
  var UnitModel = window.UnitModel;
  var UnitView = window.UnitView;

  var App = {};

  App.start = function() {
    $.getJSON('../units.json', function(units) {
      App._log('Started');
      App.setup(units);
    });
  };

  App.setup = function(units) {
    units = _.map(units, function(unit) {
      unit = new UnitModel(unit);
      return unit;
    });

    var createUnit = function(options) {
      var view = new UnitView($(options.selector), options.model);
      view.render();
    };

    var unitCreations = _.map(units, function(unit) {
      return {
        selector: '#' + unit.get('id'),
        model: unit
      };
    });

    _.forEach(unitCreations, createUnit);
  };

  App._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'App:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.App = App;
}());

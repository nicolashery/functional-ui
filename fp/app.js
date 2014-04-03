/* global $, _ */
(function() {
  var Engine = window.Engine;
  var Unit = window.Unit;
  var Summary = window.Summary;

  var App = {};

  App.state = {};

  App.start = function() {
    $.getJSON('../units.json', function(units) {
      units = _.map(units, function(unit) {
        unit.count = 0;
        return unit;
      });
      App.state.units = units;
      App._log('Started');
      App.setup();
    });
  };

  App.setup = function() {
    var units = App.state.units;

    var createUnit = function(creation) {
      Engine.create(Unit, creation.selector, creation.data, creation.handlers);
    };
    var unitCreations = _.map(units, function(unit) {
      return {
        selector: '#' + unit.id,
        data: unit,
        handlers: {
          onTrain: App.trainUnitHandler.bind(App, unit.id),
          onCancel: App.cancelUnitHandler.bind(App, unit.id)
        }
      };
    });
    _.forEach(unitCreations, createUnit);

    Engine.create(Summary, '#summary', units);
  };

  App.trainUnitHandler = function(unitId, e) {
    if (e) {
      e.preventDefault();
    }
    App.incrementUnitCount(unitId);
  };

  App.cancelUnitHandler = function(unitId, e) {
    if (e) {
      e.preventDefault();
    }
    App.resetUnitCount(unitId);
  };

  App.updateUnitCount = function(updateFunction, unitId) {
    var units = App.state.units;

    units = _.map(units, function(unit) {
      if (unit.id === unitId) {
        unit = _.clone(unit);
        unit.count = updateFunction(unit);
      }
      return unit;
    });

    App.setState({units: units});
  };

  App.incrementUnitCount = App.updateUnitCount.bind(App, function(unit) {
    return unit.count + 1;
  });

  App.resetUnitCount = App.updateUnitCount.bind(App, function() {
    return 0;
  });

  App.update = function() {
    var units = App.state.units;

    var updateUnit = function(creation) {
      Engine.update(creation.selector, creation.data);
    };
    var unitUpdates = _.map(units, function(unit) {
      return {
        selector: '#' + unit.id,
        data: unit
      };
    });
    _.forEach(unitUpdates, updateUnit);

    Engine.update('#summary', units);
  };

  App.setState = function(stateModifications) {
    _.assign(App.state, stateModifications);
    App._log('State changed');
    App.update();
  };

  App._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'App:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.App = App;
}());

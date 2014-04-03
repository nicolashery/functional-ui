/* global _ */
(function() {
  function UnitModel(attributes) {
    attributes = attributes || {};

    this._attributes = attributes;
    this._attributes.count = 0;

    this._onChangeHandlers = [];
  }

  UnitModel.prototype.set = function(attributes) {
    var self = this;
    _.forEach(attributes, function(value, name) {
      self._attributes[name] = value;
    });
    this._log('Changed', attributes);
    this._handleChange();
    return this;
  };

  UnitModel.prototype.get = function(name) {
    return this._attributes[name];
  };

  UnitModel.prototype.serialize = function() {
    return _.clone(this._attributes);
  };

  UnitModel.prototype.train = function() {
    var currentCount = this.get('count');
    this.set({count: currentCount + 1});
    return this;
  };

  UnitModel.prototype.cancel = function() {
    this.set({count: 0});
    return this;
  };

  UnitModel.prototype.addOnChangeHandler = function(handler) {
    this._onChangeHandlers.push(handler);
    return this;
  };

  UnitModel.prototype.removeOnChangeHandler = function(handler) {
    var savedHandlers = this._onChangeHandlers;
    var keepHandlers = [];
    _.forEach(savedHandlers, function(savedHandler) {
      if (savedHandler !== handler) {
        keepHandlers.push(savedHandler);
      }
    });
    this._onChangeHandlers = keepHandlers;
    return this;
  };

  UnitModel.prototype._handleChange = function() {
    var attributes = this.serialize();
    _.forEach(this._onChangeHandlers, function(handler) {
      handler(attributes);
    });
  };

  UnitModel.prototype._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'UnitModel <' + this.get('id') + '>:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.UnitModel = UnitModel;
}());

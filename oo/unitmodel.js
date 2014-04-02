/* global _ */
(function() {
  function UnitModel(attributes) {
    attributes = attributes || {};

    this._attributes = attributes;
    this._attributes.count = 0;
    this._onChange = function() {};
  }

  UnitModel.prototype.set = function(attributes) {
    var self = this;
    _.forEach(attributes, function(value, name) {
      self._attributes[name] = value;
    });
    this._log('Changed', attributes);
    this._onChange(this.serialize());
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

  UnitModel.prototype.setOnChangeHandler = function(handler) {
    this._onChange = handler;
    return this;
  };

  UnitModel.prototype.unsetOnChangeHandler = function() {
    this._onChange = function() {};
    return this;
  };

  UnitModel.prototype._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'UnitModel <' + this.get('id') + '>:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.UnitModel = UnitModel;
}());

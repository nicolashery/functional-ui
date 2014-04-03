/* global _ */
(function() {
  var UnitModel = window.UnitModel;

  var slice = [].slice;

  function UnitCollection(units) {
    this._models = [];

    _.forEach(units, this.add.bind(this));
  }

  UnitCollection.prototype.add = function(unit) {
    unit = new UnitModel(unit);
    this._models.push(unit);
  };

  UnitCollection.prototype.getTotalCost = function() {
    var totalCost = 0;

    this.forEach(function(unit) {
      var cost = unit.get('cost');
      var count = unit.get('count');
      var subTotal = cost*count;
      totalCost = totalCost + subTotal;
    });

    return totalCost;
  };

  // Allow use of some Lo-Dash methods on the collection
  _.forEach(['forEach', 'map'], function(method) {
    UnitCollection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this._models);
      return _[method].apply(_, args);
    };
  });

  window.UnitCollection = UnitCollection;
}());

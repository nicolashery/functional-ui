/* global $, _ */
(function() {
  function SummaryView(el, collection) {
    this._$el = $(el);
    this._collection = collection;

    this.update = this.update.bind(this);
    var self = this;
    this._collection.forEach(function(unit) {
      unit.addOnChangeHandler(self.update);
    });

    this._cache = {};
  }

  SummaryView.prototype.render = function() {
    var isActive = this._isActive();
    var unitsHtml = this._getUnitsHtml();
    var totalCost = this._collection.getTotalCost();

    var html = [
      '<div class="summary',
      isActive ? ' summary-active' : '',
      '">',
      '<div class="summary-header">',
      '<span class="summary-title">Summary</span>',
      '</div>',
      '<div class="summary-units">',
      unitsHtml,
      '</div>',
      '<div class="summary-total-cost">',
      'Total Cost <span class="summary-total-cost-value">',
      totalCost,
      '</span></div>',
      '</div>'
    ].join('');

    this._$el.html(html);
    this._cacheElements();
    this._cacheCollectionValues();

    this._log('Rendered');

    return this;
  };

  SummaryView.prototype._isActive = function() {
    return Boolean(this._collection.getTotalCost());
  };

  SummaryView.prototype._getUnitsHtml = function() {
    var html = [];

    var self = this;
    this._collection.forEach(function(unit) {
      var isSelected = self._isUnitSelected(unit);
      var data = unit.serialize();

      var unitHtmlItems = [
        '<div class="summary-unit',
        isSelected ? ' summary-unit-selected' : '',
        '" data-unit="',
        data.id,
        '">',
        '<span class="summary-unit-name">',
        data.name,
        '</span>',
        '<span class="summary-unit-cost">',
        'Cost <span class="summary-unit-cost-value">',
        data.cost,
        '</span></span>',
        '<span class="summary-unit-count">',
        'Quantity <span class="summary-unit-count-value">',
        data.count,
        '</span></span>',
        '</div>'
      ].join('');

      html.push(unitHtmlItems);
    });

    html = html.join('');

    return html;
  };

  SummaryView.prototype._isUnitSelected = function(unit) {
    return Boolean(unit.get('count'));
  };

  SummaryView.prototype._cacheElements = function() {
    this._$root = this._$el.find('.summary');

    this._$units = {};
    var self = this;
    this._collection.forEach(function(unit) {
      var id = unit.get('id');
      var $root = self._$el.find('.summary-unit[data-unit="' + id + '"]');
      self._$units[id] = {
        $root: $root,
        $name: $root.find('.summary-unit-name'),
        $cost: $root.find('.summary-unit-cost-value'),
        $count: $root.find('.summary-unit-count-value')
      };
    });

    this._$totalCost = this._$el.find('.summary-total-cost-value');
  };

  SummaryView.prototype._cacheCollectionValues = function() {
    this._cache.units = {};
    var self = this;
    this._collection.forEach(function(unit) {
      var id = unit.get('id');
      self._cache.units[id] = unit.serialize();
      self._cache.units[id].isSelected = self._isUnitSelected(unit);
    });

    this._cache.isActive = this._isActive();
    this._cache.totalCost = this._collection.getTotalCost();
    return this;
  };

  SummaryView.prototype.update = function() {
    this._updateActive();
    this._updateTotalCost();
    this._collection.forEach(this._updateUnit.bind(this));
    this._cacheCollectionValues();
    return this;
  };

  SummaryView.prototype._updateActive = function() {
    var isActive = this._isActive();

    if (isActive === this._cache.isActive) {
      return this;
    }

    if (isActive) {
      this._$root.addClass('summary-active');
    }
    else {
      this._$root.removeClass('summary-active');
    }

    this._log('Updated', 'isActive');
    return this;
  };

  SummaryView.prototype._updateTotalCost = function() {
    var totalCost = this._collection.getTotalCost();

    if (totalCost === this._cache.totalCost) {
      return this;
    }

    this._$totalCost.text(totalCost);

    this._log('Updated', 'totalCost');
    return this;
  };

  SummaryView.prototype._updateUnit = function(unit) {
    var $unit = this._$units[unit.get('id')];
    this._updateUnitSelected(unit, $unit);
    var attributeNames = ['name', 'cost', 'count'];
    _.forEach(attributeNames, this._updateUnitValue.bind(this, unit, $unit));
    return this;
  };

  SummaryView.prototype._updateUnitSelected = function(unit, $unit) {
    var id = unit.get('id');
    var isSelected = this._isUnitSelected(unit);

    if (isSelected === this._cache.units[id].isSelected) {
      return this;
    }

    if (isSelected) {
      $unit.$root.addClass('summary-unit-selected');
    }
    else {
      $unit.$root.removeClass('summary-unit-selected');
    }

    this._log('Updated', id, 'isSelected');
    return this;
  };

  SummaryView.prototype._updateUnitValue = function(unit, $unit, name) {
    var id = unit.get('id');
    var value = unit.get(name);

    if (value === this._cache.units[id][name]) {
      return this;
    }

    var $el = $unit['$' + name];
    $el.text(value);

    this._log('Updated', id, name);
    return this;
  };

  SummaryView.prototype.destroy = function() {
    var self = this;
    this._collection.forEach(function(unit) {
      unit.removeOnChangeHandler(self.update);
    });
    this._$el.html('');
    this._log('Destroyed');
  };

  SummaryView.prototype._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'SummaryView:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.SummaryView = SummaryView;
}());

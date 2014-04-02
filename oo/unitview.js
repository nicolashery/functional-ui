/* global $, _ */
(function() {
  function UnitView(el, model) {
    this._$el = $(el);
    this._model = model;
    this._model.setOnChangeHandler(this.update.bind(this));
    this._cache = {};
  }

  UnitView.prototype.render = function() {
    var isSelected = this._isSelected();
    var data = this._model.serialize();

    var html = [
      '<div class="unit',
      isSelected ? ' unit-selected' : '',
      '">',
      '<div class="unit-header">',
      '<span class="unit-count">(<span class="unit-count-value">',
      data.count,
      '</span>) </span>',
      '<span class="unit-name">',
      data.name,
      '</span>',
      '<a class="unit-action unit-train" href="#">Train</a>',
      '<a class="unit-action unit-cancel" href="#">Cancel</a>',
      '</div>',
      '<div class="unit-description">',
      data.description,
      '</div>',
      '<div class="unit-cost">Cost: <span class="unit-cost-value">',
      data.cost,
      '</span></div>',
      '</div>'
    ].join('');

    this._$el.html(html);
    this._cacheElements();
    this._cacheModelValues();
    this._bindDomEvents();

    this._log('Rendered');

    return this;
  };

  UnitView.prototype._isSelected = function() {
    return Boolean(this._model.get('count'));
  };

  UnitView.prototype._cacheElements = function() {
    this._$root = this._$el.find('.unit');
    this._$name = this._$el.find('.unit-name');
    this._$count = this._$el.find('.unit-count-value');
    this._$description = this._$el.find('.unit-description');
    this._$cost = this._$el.find('.unit-cost-value');
  };

  UnitView.prototype._cacheModelValues = function() {
    this._cache = this._model.serialize();
    this._cache.isSelected = this._isSelected();
    return this;
  };

  UnitView.prototype.update = function() {
    var attributeNames = ['name', 'count', 'description', 'cost'];
    _.forEach(attributeNames, this._updateValue.bind(this));
    this._updateSelected();
    this._cacheModelValues();
    return this;
  };

  UnitView.prototype._updateSelected = function() {
    var isSelected = this._isSelected();

    if (isSelected === this._cache.isSelected) {
      return this;
    }

    if (this._isSelected()) {
      this._$root.addClass('unit-selected');
    }
    else {
      this._$root.removeClass('unit-selected');
    }

    this._log('Updated', 'isSelected');
    return this;
  };

  UnitView.prototype._updateValue = function(name) {
    var value = this._model.get(name);

    if (value === this._cache[name]) {
      return this;
    }

    var $el = this['_$' + name];
    $el.text(value);

    this._log('Updated', name);
    return this;
  };

  UnitView.prototype._bindDomEvents = function() {
    this._$el.find('.unit-train').click(this._handleTrain.bind(this));
    this._$el.find('.unit-cancel').click(this._handleCancel.bind(this));
    return this;
  };

  UnitView.prototype._handleTrain = function(e) {
    if (e) {
      e.preventDefault();
    }
    this._log('Trained');
    this._model.train();
  };

  UnitView.prototype._handleCancel = function(e) {
    if (e) {
      e.preventDefault();
    }
    this._log('Canceled');
    this._model.cancel();
  };

  UnitView.prototype.destroy = function() {
    this._model.unsetOnChangeHandler();
    this._$el.html('');
    this._log('Destroyed');
  };

  UnitView.prototype._log = function() {
    var args = [].slice.call(arguments);
    var prefix = 'UnitView <' + this._model.get('id') + '>:';
    console.log.apply(console, [prefix].concat(args));
  };

  window.UnitView = UnitView;
}());

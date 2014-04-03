(function() {
  var Unit = {};

  Unit.html = function(data) {
    var isSelected = Unit.isSelected(data);

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
      '<div class="unit-cost">Cost <span class="unit-cost-value">',
      data.cost,
      '</span></div>',
      '</div>'
    ].join('');

    return html;
  };

  Unit.update = function(data) {
    return [
      {selector: '.unit-name', type: 'text', value: data.name},
      {selector: '.unit-count-value', type: 'text', value: String(data.count)},
      {selector: '.unit-description', type: 'text', value: data.description},
      {selector: '.unit-cost-value', type: 'text', value: String(data.cost)},
      {
        selector: '.unit',
        type: 'class',
        value: 'unit' + (Unit.isSelected(data) ? ' unit-selected' : '')
      }
    ];
  };

  Unit.handlers = function() {
    return [
      {selector: '.unit-train', name: 'onTrain', type: 'click'},
      {selector: '.unit-cancel', name: 'onCancel', type: 'click'}
    ];
  };

  Unit.isSelected = function(data) {
    return Boolean(data.count);
  };

  window.Unit = Unit;
}());

/* global _ */
(function() {
  var Summary = {};

  Summary.html = function(data) {
    var isActive = Summary.isActive(data);
    var unitsHtml = Summary.unitsHtml(data);
    var totalCost = Summary.totalCost(data);

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

    return html;
  };

  Summary.unitsHtml = function(data) {
    var html = _.map(data, function(unit) {
      var isSelected = Summary.isUnitSelected(unit);

      return [
        '<div class="summary-unit',
        isSelected ? ' summary-unit-selected' : '',
        '" data-unit="',
        unit.id,
        '">',
        '<span class="summary-unit-name">',
        unit.name,
        '</span>',
        '<span class="summary-unit-cost">',
        'Cost <span class="summary-unit-cost-value">',
        unit.cost,
        '</span></span>',
        '<span class="summary-unit-count">',
        'Quantity <span class="summary-unit-count-value">',
        unit.count,
        '</span></span>',
        '</div>'
      ].join('');
    });

    html = html.join('');

    return html;
  };

  Summary.update = function(data) {
    var updates = [
      {
        selector: '.summary-total-cost-value',
        type: 'text',
        value: String(Summary.totalCost(data)),
      },
      {
        selector: '.summary',
        type: 'class',
        value: 'summary' + (Summary.isActive(data) ? ' summary-active' : '')
      }
    ];

    var unitsUpdates = _.chain(data)
      .map(Summary.updateUnit)
      .flatten(true)
      .value();
    updates = updates.concat(unitsUpdates);

    return updates;
  };

  Summary.updateUnit = function(unit) {
    var htmlDataSelector = '[data-unit="' + unit.id + '"]';

    return [
      {
        selector: htmlDataSelector + ' .summary-unit-name',
        type: 'text',
        value: unit.name
      },
      {
        selector: htmlDataSelector + ' .summary-unit-cost-value',
        type: 'text',
        value: String(unit.cost)
      },
      {
        selector: htmlDataSelector + ' .summary-unit-count-value',
        type: 'text',
        value: String(unit.count)
      },
      {
        selector: '.summary-unit' + htmlDataSelector,
        type: 'class',
        value: [
          'summary-unit',
          Summary.isUnitSelected(unit) ? ' summary-unit-selected' : ''
        ].join(' ')
      }
    ];
  };

  Summary.handlers = function() {
    return [];
  };

  Summary.isActive = function(data) {
    return Boolean(Summary.totalCost(data));
  };

  Summary.totalCost = function(data) {
    return _.reduce(data, function(totalCost, unit) {
      return totalCost + unit.cost*unit.count;
    }, 0);
  };

  Summary.isUnitSelected = function(unit) {
    return Boolean(unit.count);
  };

  window.Summary = Summary;
}());

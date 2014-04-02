/* global $, _ */
(function() {
  var Engine = {};

  Engine._state = {};

  Engine.create = function(component, selector, data, handlers) {
    var $el = $(selector);

    var html = component.html(data);
    $el.html(html);

    Engine._state[selector] = {
      $el: $el,
      component: component
    };
    Engine._addNodeState(selector, data);
    Engine._addNodeHandlers(selector, handlers);
    Engine.handlers(selector, handlers);

    Engine._log(selector, 'created');
  };

  Engine._addNodeState = function(selector, data) {
    var node = Engine._state[selector];
    var $el = node.$el;
    var component = node.component;

    var instructions = component.update(data);
    var state = _.reduce(instructions, function(acc, instruction) {
      var key = instruction.selector + ' ' + instruction.type;
      acc[key] = _.extend(instruction, {
        $el: $el.find(instruction.selector)
      });
      return acc;
    }, {});

    node.state = state;
  };

  Engine._addNodeHandlers = function(selector, newHandlers) {
    newHandlers = newHandlers || {};
    var node = Engine._state[selector];
    var $el = node.$el;
    var component = node.component;

    var instructions = component.handlers();
    var handlers = _.reduce(instructions, function(acc, instruction) {
      var key = instruction.name;
      acc[key] = _.extend(instruction, {
        $el: $el.find(instruction.selector),
        handler: newHandlers[instruction.name] || null
      });
      return acc;
    }, {});

    node.handlers = handlers;
  };

  Engine.update = function(selector, data) {
    var node = Engine._state[selector];
    var component = node.component;
    var prevState = node.state;

    var instructions = component.update(data);
    _.forEach(instructions, function(instruction) {
      var key = instruction.selector + ' ' + instruction.type;
      var child = prevState[key];
      var $el = child.$el;
      var type = instruction.type;
      var newValue = instruction.value;
      if (newValue !== child.value) {
        if (type === 'text') {
          $el.text(newValue);
        }
        else if (type === 'class') {
          $el.attr('class', newValue);
        }

        child.value = newValue;
        Engine._log(selector, 'updated', key);
      }
    });
  };

  Engine.handlers = function(selector, newHandlers) {
    newHandlers = newHandlers || {};
    var node = Engine._state[selector];
    var component = node.component;
    var prevHandlers = node.handlers;

    var instructions = component.handlers();
    _.forEach(instructions, function(instruction) {
      var key = instruction.name;
      var child = prevHandlers[key];
      var $el = child.$el;
      var type = instruction.type;
      var handler = newHandlers[instruction.name] || null;
      if (type === 'click') {
        $el.click(function(e) {
          if (handler) {
            Engine._log(selector, 'handled', key);
            handler(e);
          }
        });
      }
      child.handler = handler;
    });
  };

  Engine.destroy = function(selector) {
    var node = Engine._state[selector];
    var $el = node.$el;

    $el.html('');

    delete Engine._state[selector];

    Engine._log(selector, 'destroyed');
  };

  Engine._log = function(selector) {
    var args = [].slice.call(arguments, 1);
    var prefix = 'Engine: <' + selector + '>';
    console.log.apply(console, [prefix].concat(args));
  };

  window.Engine = Engine;
}());

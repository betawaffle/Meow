(function() {
  var Meow, after, every;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  every = function() {
    var args, func, time, timer, _i;
    time = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), func = arguments[_i++];
    timer = setInterval.apply(null, [func, time].concat(__slice.call(args)));
    return {
      stop: function() {
        clearInterval(timer);
        delete this.stop;
      }
    };
  };
  after = function() {
    var args, func, time, timer, _i;
    time = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), func = arguments[_i++];
    timer = setTimeout.apply(null, [func, time].concat(__slice.call(args)));
    return {
      stop: function() {
        clearTimeout(timer);
        delete this.stop;
      }
    };
  };
  Meow = (function() {
    Meow.active = {};
    Meow.create = function(msg, opts) {
      var meow, title, type;
      if (typeof opts.title === 'string') {
        title = opts.title;
      }
      type = typeof msg;
      if (type === 'object') {
        title || (title = msg.attr('title'));
        type = msg.get(0).nodeName;
      }
      switch (type) {
        case 'string':
          break;
        case 'INPUT':
        case 'SELECT':
        case 'TEXTAREA':
          msg = msg.attr('value');
          break;
        default:
          msg = msg.text();
      }
      meow = new Meow(msg, {
        message_type: type,
        trigger: opts.trigger,
        icon: typeof opts.icon === 'string' ? opts.icon : void 0
      });
      return this.active[meow.timestamp] = meow;
    };
    Meow.prototype.duration = 2400;
    Meow.prototype.hovered = false;
    function Meow(message, opts) {
      var inner;
      this.message = message;
      this.destroy = __bind(this.destroy, this);
      this.title = opts.title;
      this.icon = opts.icon;
      this.elem = $('<div/>', {
        "class": 'meow',
        id: "meow-" + (this.timestamp = Date.now())
      }).html(inner = $('<div/>', {
        "class": 'inner'
      }).text(this.message));
      if (typeof this.title === 'string') {
        inner.prepend($('<h1/>').text(this.title));
      }
      if (typeof this.icon === 'string') {
        inner.prepend($('<div/>', {
          "class": 'icon'
        }).html($('<img/>', {
          src: this.icon
        })));
      }
      $('#meows').append(this.elem.hide().fadeIn(400));
      this.elem.bind('mouseenter mouseleave', __bind(function(event) {
        if (this.hovered = event.type !== 'mouseleave') {
          this.elem.removeClass('hover');
          if (this.timestamp + this.duration <= Date.now()) {
            return this.destroy();
          }
        } else {
          return this.elem.addClass('hover');
        }
      }, this));
      this.timer = after(this.duration, __bind(function() {
        if (this.hovered !== true && typeof this === 'object') {
          this.destroy();
        }
      }, this));
    }
    Meow.prototype.destroy = function() {
      this.elem.find('.inner').fadeTo(400, 0, __bind(function() {
        this.elem.slideUp(__bind(function() {
          this.elem.remove();
          delete Meow.active[this.timestamp];
        }, this));
      }, this));
    };
    return Meow;
  })();
  $.fn.meow = function(msg, opts) {
    var create, trigger, _ref;
    trigger = (_ref = opts.trigger) != null ? _ref : opts;
    if (typeof opts !== 'object') {
      opts = {};
    }
    create = function() {
      return Meow.create(msg, opts);
    };
    if (typeof trigger === 'string') {
      return this.each(function() {
        return $(this).bind(trigger, create);
      });
    } else {
      return this.each(create);
    }
  };
}).call(this);

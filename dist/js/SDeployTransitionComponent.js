'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _gsap = require('gsap');

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _debounce = require('coffeekraken-sugar/js/utils/functions/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Create a nice layered transition for your webapp with fully customizable look and feel.
 * @example    html
 * <s-layers-transition layers="[{color:'#ff0000',side:'left'},{color:'#00ff00',side:'right'}]"></s-layers-transition>
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 * @see    https://ddd.ge    Inspiration source
 */
var SLayersTransitionComponent = function (_SWebComponent) {
  _inherits(SLayersTransitionComponent, _SWebComponent);

  function SLayersTransitionComponent() {
    _classCallCheck(this, SLayersTransitionComponent);

    return _possibleConstructorReturn(this, (SLayersTransitionComponent.__proto__ || Object.getPrototypeOf(SLayersTransitionComponent)).apply(this, arguments));
  }

  _createClass(SLayersTransitionComponent, [{
    key: 'componentWillMount',


    /**
     * Component will mount
     * @definition    SWebComponent.componentWillMount
     * @protected
     */
    value: function componentWillMount() {
      var _this2 = this;

      _get(SLayersTransitionComponent.prototype.__proto__ || Object.getPrototypeOf(SLayersTransitionComponent.prototype), 'componentWillMount', this).call(this);

      // flags
      this._isTransitionIn = false;
      this._isTransitionOut = false;

      // layers
      this._layers = [];

      // create a canvas to draw in
      this.$canvasElm = document.createElement('canvas');
      this.appendChild(this.$canvasElm);

      // set the layers
      this.props.layers.forEach(function (layer) {
        _this2._addLayer(layer.color);
      });

      // listen for resize through transitionend event
      this.addEventListener('transitionend', (0, _debounce2.default)(function (e) {
        // set points
        _this2._setPointPositionAndCanvasSize();
      }, 100));
    }

    /**
     * Set points position and canvas size
     */

  }, {
    key: '_setPointPositionAndCanvasSize',
    value: function _setPointPositionAndCanvasSize() {
      var _this3 = this;

      var _ref = [this.offsetWidth, this.offsetHeight],
          w = _ref[0],
          h = _ref[1];
      // set canvas size

      this.$canvasElm.width = w;
      this.$canvasElm.height = h;
      // loop on each layers
      this._layers.forEach(function (layer) {
        if (_this3._isTransitionIn) {
          layer.points[0] = { x: 0, y: h };
          layer.points[1] = { x: w, y: h };
          layer.points[3] = { x: 0, y: 0 };
        } else if (_this3._isTransitionOut) {
          layer.points[1] = { x: w, y: h };
          layer.points[2] = { x: w, y: 0 };
          layer.points[3] = { x: 0, y: 0 };
        } else {
          layer.points[0] = { x: 0, y: h };
          layer.points[1] = { x: w, y: h };
          layer.points[2] = { x: 0, y: h };
          layer.points[3] = { x: 0, y: 0 };
        }
      });
    }

    /**
     * Component will receive prop
     * @definition    SWebComponent.componentWillReceiveProp
     * @protected
     */

  }, {
    key: 'componentWillReceiveProp',
    value: function componentWillReceiveProp(name, newVal, oldVal) {
      var _this4 = this;

      switch (name) {
        case 'layers':
          this._layers = [];
          // set the layers
          this.props.layers.forEach(function (layer) {
            _this4._addLayer(layer.color);
          });
          break;
      }
    }

    /**
     * Add a layer to be drawn
     * @param    {String}    color    The color of the layer
     * @private
     * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
     */

  }, {
    key: '_addLayer',
    value: function _addLayer(color) {
      var _ref2 = [this.offsetWidth, this.offsetHeight],
          w = _ref2[0],
          h = _ref2[1];

      this._layers.push({
        color: color,
        points: [{ x: 0, y: h }, { x: w, y: h }, { x: 0, y: h }, { x: 0, y: 0 }]
      });
    }

    /**
     * Animate the transition in
     * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
     */

  }, {
    key: 'animateIn',
    value: function animateIn() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        // add the active class
        _this5.classList.add('active');
        // flag
        _this5._isTransitionIn = true;

        setTimeout(function () {
          var ctx = _this5.$canvasElm.getContext('2d');
          var _ref3 = [_this5.offsetWidth, _this5.offsetHeight],
              w = _ref3[0],
              h = _ref3[1];

          _this5.$canvasElm.width = w;
          _this5.$canvasElm.height = h;
          ctx.globalCompositeOperation = 'add';

          var tl = new _gsap.TimelineMax({
            onComplete: function onComplete() {
              // flag
              _this5._isTransitionIn = false;
              // promise
              resolve(_this5);
              /**
               * @event
               * @name    in:complete
               * Event dispatched when the transition in is completed
               */
              (0, _dispatchEvent2.default)(_this5, 'in:complete');
            },
            onUpdate: function onUpdate() {
              ctx.clearRect(0, 0, w, h);

              _this5._layers.forEach(function (layer, i) {
                ctx.beginPath();
                ctx.moveTo(layer.points[0].x, layer.points[0].y);
                ctx.lineTo(layer.points[1].x, layer.points[1].y);
                ctx.lineTo(layer.points[2].x, layer.points[2].y);
                ctx.lineTo(layer.points[3].x, layer.points[3].y);
                ctx.closePath();
                ctx.fillStyle = layer.color;
                ctx.fill();
              });
            }
          });

          var d = _this5.props.duration;

          _this5._layers.forEach(function (layer, i) {
            tl.insert(new _gsap.TweenMax(layer.points[2], d, { y: 0, x: w, ease: _gsap.Expo.easeInOut }), _this5.props.delay * i);
          });
        });
      });
    }

    /**
     * Animate the transition out
     * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
     */

  }, {
    key: 'animateOut',
    value: function animateOut() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        // flag
        _this6._isTransitionOut = true;

        setTimeout(function () {
          // avoid flickering
          var ctx = _this6.$canvasElm.getContext('2d');
          var _ref4 = [_this6.offsetWidth, _this6.offsetHeight],
              w = _ref4[0],
              h = _ref4[1];

          _this6.$canvasElm.width = w;
          _this6.$canvasElm.height = h;
          ctx.globalCompositeOperation = 'add';

          var tl = new _gsap.TimelineMax({
            onComplete: function onComplete() {
              // flag
              _this6._isTransitionOut = false;
              // remove the active class
              _this6.classList.remove('active');
              // reset points
              _this6._layers.forEach(function (layer) {
                layer.points = [{ x: 0, y: h }, { x: w, y: h }, { x: 0, y: h }, { x: 0, y: 0 }];
              });
              // promise
              resolve(_this6);
              /**
              * @event
              * @name    out:complete
              * Event dispatched when the transition out is completed
              */
              (0, _dispatchEvent2.default)(_this6, 'out:complete');
            },
            onUpdate: function onUpdate() {
              ctx.clearRect(0, 0, w, h);

              _this6._layers.forEach(function (layer) {
                ctx.beginPath();
                ctx.moveTo(layer.points[0].x, layer.points[0].y);
                ctx.lineTo(layer.points[1].x, layer.points[1].y);
                ctx.lineTo(layer.points[2].x, layer.points[2].y);
                ctx.lineTo(layer.points[3].x, layer.points[3].y);
                ctx.closePath();
                ctx.fillStyle = layer.color;
                ctx.fill();
              });
            }
          });

          var d = _this6.props.duration;

          _this6._layers.forEach(function (layer, i) {
            tl.insert(new _gsap.TweenMax(layer.points[0], d, { y: 0, x: w, ease: _gsap.Expo.easeInOut }), _this6.props.delay * (_this6._layers.length - 1) - _this6.props.delay * i);
          });
        }, 10);
      });
    }
  }], [{
    key: 'defaultCss',


    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return '\n      ' + componentNameDash + ' {\n        display: block;\n        pointer-events: none;\n        transition: width 0.01s linear 0s, height 0.01s linear 0s;\n      }\n      ' + componentNameDash + '.active {\n        pointer-events: all;\n      }\n    ';
    }
  }, {
    key: 'defaultProps',

    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     * @protected
     */
    get: function get() {
      return {

        /**
         * Specify the delay in second between each layers animations
         * @prop
         * @type    {Number}
         */
        delay: 0.05,

        /**
         * Specify the duration of 1 layer animation in second
         * @prop
         * @type    {Number}
         */
        duration: 1,

        /**
         * Set the layers. One layer in composed of:
         * ```js
         * {
         *  color: '#ff0000'
         * }
         * ```
         *
         * @prop
         * @type    {Array<Object>}
         */
        layers: [{
          color: '#242c2f'
        }, {
          color: '#f2bc2b'
        }]
      };
    }
  }]);

  return SLayersTransitionComponent;
}(_SWebComponent3.default);

exports.default = SLayersTransitionComponent;
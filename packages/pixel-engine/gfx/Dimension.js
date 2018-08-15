"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DIMENSION_AUTO = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _EventEmitter2 = _interopRequireDefault(require("../utils/EventEmitter"));

var DIMENSION_AUTO = 1 << 0;
exports.DIMENSION_AUTO = DIMENSION_AUTO;

var Dimension =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Dimension, _EventEmitter);

  function Dimension() {
    var _this;

    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    (0, _classCallCheck2.default)(this, Dimension);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Dimension).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onWindowResize", function () {
      _this._width = window.innerWidth;
      _this._height = window.innerHeight;

      _this.emit('change', (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    });
    _this.options = options;
    _this.width = width;
    _this.height = height;

    if (_this.options & DIMENSION_AUTO) {
      window.addEventListener('resize', _this.onWindowResize, false);

      _this.onWindowResize();
    }

    return _this;
  }

  (0, _createClass2.default)(Dimension, [{
    key: "dispose",
    value: function dispose() {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Dimension.prototype), "dispose", this).call(this);
      window.removeEventListener('resize', this.onWindowResize);
    }
  }, {
    key: "width",
    set: function set(width) {
      this._width = width;
      this.emit('change', this);
    }
  }, {
    key: "height",
    set: function set(height) {
      this._height = height;
      this.emit('change', this);
    }
  }]);
  return Dimension;
}(_EventEmitter2.default);

exports.default = Dimension;
(0, _defineProperty2.default)(Dimension, "DIMENSION_AUTO", DIMENSION_AUTO);
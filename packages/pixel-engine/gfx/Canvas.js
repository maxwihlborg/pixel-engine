"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CANVAS_GL_CONTEXT = exports.CANVAS_2D_CONTEXT = exports.CANVAS_APPEND = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var CANVAS_APPEND = 1 << 0;
exports.CANVAS_APPEND = CANVAS_APPEND;
var CANVAS_2D_CONTEXT = 1 << 1;
exports.CANVAS_2D_CONTEXT = CANVAS_2D_CONTEXT;
var CANVAS_GL_CONTEXT = 1 << 2;
exports.CANVAS_GL_CONTEXT = CANVAS_GL_CONTEXT;

var Canvas =
/*#__PURE__*/
function () {
  function Canvas(_dimension) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.createElement('canvas');
    (0, _classCallCheck2.default)(this, Canvas);
    (0, _defineProperty2.default)(this, "onDimensionChange", function (dimension) {
      _this.view.width = dimension.width;
      _this.view.height = dimension.height;
    });
    this.view = view;
    this.options = options;
    this.setDimension(_dimension);

    if (this.options & CANVAS_2D_CONTEXT) {
      this.ctx = this.view.getContext('2d');
    }

    if (this.options & CANVAS_GL_CONTEXT) {
      this.ctx = this.view.getContext('webgl');
    }

    if (this.options & CANVAS_APPEND) {
      document.body.appendChild(this.view);
    }
  }

  (0, _createClass2.default)(Canvas, [{
    key: "getContext",
    value: function getContext() {
      if (this.options & CANVAS_2D_CONTEXT) {
        return this.ctx;
      }

      if (this.options & CANVAS_GL_CONTEXT) {
        return this.gl;
      }

      return null;
    }
  }, {
    key: "setDimension",
    value: function setDimension(dimension) {
      if (this.dimension) {
        this.dimension.off('change', this.onDimensionChange);
      }

      this.dimension = dimension;
      this.dimension.on('change', this.onDimensionChange);
      this.dimension.emit('change', this.dimension);
    }
  }]);
  return Canvas;
}();

exports.default = Canvas;
(0, _defineProperty2.default)(Canvas, "CANVAS_APPEND", CANVAS_APPEND);
(0, _defineProperty2.default)(Canvas, "CANVAS_2D_CONTEXT", CANVAS_2D_CONTEXT);
(0, _defineProperty2.default)(Canvas, "CANVAS_GL_CONTEXT", CANVAS_GL_CONTEXT);
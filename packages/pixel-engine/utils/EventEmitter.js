"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    (0, _classCallCheck2.default)(this, EventEmitter);
    this.eventListeners = new Map();
  }

  (0, _createClass2.default)(EventEmitter, [{
    key: "emit",
    value: function emit(evt) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.eventListeners.has(evt)) {
        this.eventListeners.get(evt).forEach(function (cb) {
          return cb.apply(void 0, args);
        });
      }

      return this;
    }
  }, {
    key: "off",
    value: function off(evt, cb) {
      if (!this.eventListeners.has(evt)) {
        return this;
      }

      if (this.eventListeners.get(evt).has(cb)) {
        this.eventListeners.get(evt).delete(cb);

        if (!this.eventListeners.get(evt).size) {
          this.eventListeners.delete(evt);
        }
      }

      return this;
    }
  }, {
    key: "on",
    value: function on(evt, cb) {
      if (!this.eventListeners.has(evt)) {
        this.eventListeners.set(evt, new Set([cb]));
        return this;
      }

      if (!this.eventListeners.get(evt).has(cb)) {
        this.eventListeners.get(evt).add(cb);
      }

      return this;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.eventListeners = null;
    }
  }]);
  return EventEmitter;
}();

exports.default = EventEmitter;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mouseMath = require('./mouseMath.js');

var _mouseMath2 = _interopRequireDefault(_mouseMath);

var _debug = require('./debug.js');

var _debug2 = _interopRequireDefault(_debug);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function makeSelectable(Component) {
  var _class, _temp;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var _options$containerDiv = options.containerDiv;
  var containerDiv = _options$containerDiv === undefined ? true : _options$containerDiv;
  var _options$sorter = options.sorter;
  var sorter = _options$sorter === undefined ? function (a, b) {
    return a - b;
  } : _options$sorter;
  var _options$nodevalue = options.nodevalue;
  var nodevalue = _options$nodevalue === undefined ? function (node) {
    return node.props.value;
  } : _options$nodevalue;

  if (!Component) throw new Error("Component is undefined");
  var displayName = Component.displayName || Component.name || 'Component';

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, props));

      _this.touchStart = _this.touchStart.bind(_this);
      _this.touchEnd = _this.touchEnd.bind(_this);
      _this.touchMove = _this.touchMove.bind(_this);
      _this.touchCancel = _this.touchCancel.bind(_this);

      _this.mouseDown = _this.mouseDown.bind(_this);
      _this.mouseUp = _this.mouseUp.bind(_this);
      _this.mouseMove = _this.mouseMove.bind(_this);
      _this.click = _this.click.bind(_this);
      _this.mouseDownData = null;
      _this.clickTolerance = 2;
      _this.handlers = {
        stopmouseup: function stopmouseup() {
          return null;
        },
        stopmousemove: function stopmousemove() {
          return null;
        },
        stoptouchend: function stoptouchend() {
          return null;
        },
        stoptouchmove: function stoptouchmove() {
          return null;
        },
        stoptouchcancel: function stoptouchcancel() {
          return null;
        }
      };
      _this.selectables = {};
      _this.selectableKeys = [];
      _this.sortedNodes = [];
      _this.containerDiv = containerDiv;
      _this.state = {
        selecting: false,
        selectedNodes: {},
        selectedNodeList: [],
        selectedValues: {},
        selectedValueList: []
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'updateState',
      value: function updateState(selecting, nodes, values) {
        var _this2 = this;

        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.selection) {
          console.log('updatestate: ', selecting, nodes, values);
        }
        var newnodes = nodes === null ? this.state.selectedNodes : nodes;
        var newvalues = values === null ? this.state.selectedValues : values;
        this.setState({
          selecting: selecting === null ? this.state.selecting : selecting,
          selectedNodes: newnodes,
          selectedValues: newvalues,
          containerBounds: this.bounds
        });
        if (this.props.onSelectSlot || this.props.onFinishSelect) {
          (function () {
            var nodelist = Object.keys(newnodes).map(function (key) {
              return newnodes[key];
            }).sort(function (a, b) {
              return nodevalue(a.node) - nodevalue(b.node);
            });
            var valuelist = Object.keys(newvalues).map(function (key) {
              return newvalues[key];
            }).sort(sorter);
            if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.selection) {
              console.log('updatestate onSelectSlot', values, nodes, valuelist, nodelist, _this2.bounds);
            }
            if (_this2.props.onSelectSlot) {
              _this2.props.onSelectSlot(values, function () {
                return nodes;
              }, valuelist, function () {
                return nodelist;
              }, _this2.bounds);
            }
          })();
        }
      }
    }, {
      key: 'propagateFinishedSelect',
      value: function propagateFinishedSelect() {
        if (!this.props.onFinishSelect) return;
        var newnodes = this.state.selectedNodes;
        var newvalues = this.state.selectedValues;
        var nodelist = Object.keys(newnodes).map(function (key) {
          return newnodes[key];
        }).sort(function (a, b) {
          return sorter(nodevalue(a.node), nodevalue(b.node));
        });
        var valuelist = Object.keys(newvalues).map(function (key) {
          return newvalues[key];
        }).sort(sorter);
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.selection) {
          console.log('finishselect', newvalues, newnodes, valuelist, nodelist, this.bounds);
        }
        this.props.onFinishSelect(newvalues, function () {
          return newnodes;
        }, valuelist, function () {
          return nodelist;
        }, this.bounds);
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        var _this3 = this;

        return {
          registerSelectable: function registerSelectable(component, key, value, callback) {
            if (!_this3.selectables.hasOwnProperty(key)) {
              _this3.selectableKeys.push(key);
              _this3.sortedNodes.push({ component: component, key: key, value: value, callback: callback });
            }
            if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.registration) {
              console.log('registered: ' + key, value);
            }
            _this3.selectables[key] = { component: component, value: value, callback: callback };
          },
          unregisterSelectable: function unregisterSelectable(component, key) {
            delete _this3.selectables[key];
            _this3.selectableKeys = _this3.selectableKeys.filter(function (itemKey) {
              return itemKey !== key;
            });
            if (_this3.state.selectedNodes[key]) {
              var nodes = _this3.state.selectedNodes;
              var values = _this3.state.selectedValues;
              delete nodes[key];
              delete values[key];
              _this3.updateState(null, nodes, values);
            }
          },
          selectedNodes: this.state.selectedNodes,
          selectedValues: this.state.selectedValues
        };
      }
    }, {
      key: 'addListener',
      value: function addListener(node, type, handler) {
        var _this4 = this;

        node.addEventListener(type, handler);
        this.handlers['stop' + type] = function () {
          node.removeEventListener(type, handler);
          _this4.handlers['stop' + type] = function () {
            return null;
          };
        };
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.handlers.stopmousedown) {
          this.handlers.stopmousedown();
        }
        if (this.handlers.stopmouseup) {
          this.handlers.stopmouseup();
        }
        if (this.handlers.stopmousemove) {
          this.handlers.stopmousemove();
        }
        if (this.handlers.stoptouchend) {
          this.handlers.stoptouchend();
        }
        if (this.handlers.stoptouchmove) {
          this.handlers.stoptouchmove();
        }
        if (this.handlers.stoptouchcancel) {
          this.handlers.stoptouchcancel();
        }
      }
    }, {
      key: 'touchStart',
      value: function touchStart(e) {
        var _this5 = this;

        this.startSelectHandler(e, this.props.onTouchStart, 'touchstart', function () {
          _this5.addListener(document, 'touchend', _this5.touchEnd);
          _this5.addListener(document, 'touchmove', _this5.touchMove);
        });
      }
    }, {
      key: 'mouseDown',
      value: function mouseDown(e) {
        var _this6 = this;

        this.startSelectHandler(e, this.props.onMouseDown, 'mousedown', function () {
          _this6.addListener(document, 'mouseup', _this6.mouseUp);
          _this6.addListener(document, 'mousemove', _this6.mouseMove);
        });
      }
    }, {
      key: 'startSelectHandler',
      value: function startSelectHandler(e, priorHandler, eventname, newEvents) {
        var invalid = e.touches && e.touches.length > 1;
        if (!this.props.selectable || invalid) {
          if (priorHandler) {
            priorHandler(e);
          }
          return;
        }
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.clicks) {
          console.log(eventname);
        }
        if (!this.props.selectable) return;
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.clicks) {
          console.log(eventname + ': selectable');
        }
        if (!this.node) {
          this.node = (0, _reactDom.findDOMNode)(this.ref);
          this.bounds = _mouseMath2.default.getBoundsForNode(this.node);
        }
        var coords = _mouseMath2.default.getCoordinates(e, e.touches[0].identifier);
        console.log(coords);
        if (e.which === 3 || e.button === 2 || !_mouseMath2.default.contains(this.node, coords.clientX, coords.clientY)) {
          if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.clicks) {
            console.log(eventname + ': buttons or not contained');
          }
          return;
        }
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.clicks) {
          console.log(eventname + ': left click');
        }
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.bounds) {
          console.log(eventname + ': bounds', this.bounds, e.pageY, e.pageX);
        }
        if (!_mouseMath2.default.objectsCollide(this.bounds, {
          top: coords.pageY,
          left: coords.pageX
        })) return;
        if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.clicks) {
          console.log(eventname + ': maybe select');
        }

        this.mouseDownData = {
          x: coords.pageX,
          y: coords.pageY,
          clientX: coords.clientX,
          clientY: coords.clientY,
          touchID: e.touches ? e.touches[0].identifier : false
        };

        if (this.props.constantSelect) {
          this._selectRect = _mouseMath2.default.createSelectRect(coords, this.mouseDownData);
          this.selectNodes(e);
        }

        e.preventDefault();

        newEvents();
      }
    }, {
      key: 'click',
      value: function click(e) {
        if (!this.props.selectable) {
          if (this.props.onClick) {
            this.props.onClick(e);
          }
          return;
        }
        if (!this.mouseDownData) return;
        this.handlers.stopmouseup();
        this.handlers.stopmousemove();
        this._selectRect = _mouseMath2.default.createSelectRect(e, this.mouseDownData);
        if (this.props.constantSelect && !this.props.preserveSelection) {
          this.deselectNodes();
          return;
        }
        this.selectNodes();
      }
    }, {
      key: 'touchEnd',
      value: function touchEnd(e) {
        this.handlers.stoptouchmove();
        this.handlers.stoptouchend();

        if (!this.mouseDownData) return;
        this.endSelect(e);
      }
    }, {
      key: 'touchCancel',
      value: function touchCancel() {
        this.handlers.stoptouchmove();
        this.handlers.stoptouchend();
        this.deselectNodes();
        this.propagateFinishedSelect();
        this.setState({ selecting: false });
      }
    }, {
      key: 'mouseUp',
      value: function mouseUp(e) {
        this.handlers.stopmouseup();
        this.handlers.stopmousemove();

        if (!this.mouseDownData) return;
        this.endSelect(e);
      }
    }, {
      key: 'endSelect',
      value: function endSelect(e) {
        if (_mouseMath2.default.isClick(e, this.mouseDownData, this.clickTolerance)) {
          if (this.state.selecting) {
            this.setState({ selecting: false });
          }
          return;
        }

        if (this.props.constantSelect && !this.props.preserveSelection) {
          this.propagateFinishedSelect();
          this.deselectNodes();
          return;
        }
        this.selectNodes();
      }
    }, {
      key: 'touchMove',
      value: function touchMove(e) {
        if (!this.mouseDownData) return;
        this.expandSelect(e);
      }
    }, {
      key: 'mouseMove',
      value: function mouseMove(e) {
        if (!this.mouseDownData) return;
        this.expandSelect(e);
      }
    }, {
      key: 'expandSelect',
      value: function expandSelect(e) {
        var old = this.state.selecting;

        if (!old) {
          this.setState({ selecting: true });
        }

        var coords = _mouseMath2.default.getCoordinates(e, this.mouseDownData.touchID);
        if (!_mouseMath2.default.isClick(coords, this.mouseDownData, this.clickTolerance)) {
          this._selectRect = _mouseMath2.default.createSelectRect(coords, this.mouseDownData);
        }
        if (this.props.constantSelect) {
          this.selectNodes();
        }
      }
    }, {
      key: 'deselectNodes',
      value: function deselectNodes() {
        var _this7 = this;

        var changed = false;
        Object.keys(this.state.selectedNodes).forEach(function (key) {
          changed = true;
          _this7.selectables[key].callback(false, {}, {});
        });
        if (changed) {
          this.updateState(false, {}, {});
        }
      }
    }, {
      key: 'selectNodes',
      value: function selectNodes() {
        var _this8 = this;

        var nodes = _extends({}, this.state.selectedNodes);
        var values = _extends({}, this.state.selectedValues);
        var changedNodes = [];
        var selectedIndices = [];
        var saveNode = function saveNode(node, bounds) {
          if (nodes[node.key] !== undefined) return;
          if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.selection) {
            console.log('select: ' + node.key);
          }
          nodes[node.key] = { node: node.component, bounds: bounds };
          values[node.key] = node.value;
          changedNodes.push([true, node]);
        };

        this.sortedNodes.forEach(function (node, idx) {
          var domnode = (0, _reactDom.findDOMNode)(node.component);
          var key = node.key;
          var bounds = _mouseMath2.default.getBoundsForNode(domnode);
          if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.bounds) {
            console.log('node ' + key + ' bounds', bounds);
          }
          if (!domnode || !_mouseMath2.default.objectsCollide(_this8._selectRect, bounds, _this8.clickTolerance, key)) {
            if (nodes[key] === undefined) return;
            if (_debug2.default.DEBUGGING.debug && _debug2.default.DEBUGGING.selection) {
              console.log('deselect: ' + key);
            }
            delete nodes[key];
            delete values[key];
            changedNodes.push([false, node]);
            return;
          }
          selectedIndices.push(idx);
          saveNode(node, bounds);
        });
        if (this.props.selectIntermediates) {
          (function () {
            var min = Math.min.apply(Math, selectedIndices);
            var max = Math.max.apply(Math, selectedIndices);
            var filled = Array.apply(min, Array(max - min)).map(function (x, y) {
              return min + y + 1;
            });
            filled.unshift(min);
            var diff = filled.filter(function (val) {
              return selectedIndices.indexOf(val) === -1;
            });
            diff.forEach(function (idx) {
              return saveNode(_this8.sortedNodes[idx], _mouseMath2.default.getBoundsForNode((0, _reactDom.findDOMNode)(_this8.sortedNodes[idx].component)));
            });
          })();
        }
        if (changedNodes.length) {
          changedNodes.forEach(function (item) {
            item[1].callback(item[0], nodes, values);
          });
          this.updateState(null, nodes, values);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this9 = this;

        if (this.containerDiv) {
          return _react2.default.createElement(
            'div',
            {
              onMouseDown: this.mouseDown,
              onClick: this.click,
              onTouchStart: this.touchStart,
              onTouchMove: this.touchMove,
              onTouchEnd: this.touchEnd,
              onTouchCancel: this.touchCancel
            },
            _react2.default.createElement(Component, _extends({}, this.props, this.state, {
              ref: function ref(_ref) {
                _this9.ref = _ref;
              }
            }))
          );
        }
        return _react2.default.createElement(Component, _extends({}, this.props, this.state, {
          onMouseDown: this.mouseDown,
          onClick: this.click,
          onTouchStart: this.touchStart,
          onTouchMove: this.touchMove,
          onTouchEnd: this.touchEnd,
          onTouchCancel: this.touchCancel,
          ref: function ref(_ref2) {
            _this9.ref = _ref2;
          }
        }));
      }
    }]);

    return _class;
  }(_react2.default.Component), _class.displayName = 'Selection(' + displayName + ')', _class.propTypes = {
    clickTolerance: _react.PropTypes.number,
    constantSelect: _react.PropTypes.bool,
    selectable: _react.PropTypes.bool,
    preserveSelection: _react.PropTypes.bool,
    selectIntermediates: _react.PropTypes.bool,
    onSelectSlot: _react.PropTypes.func,
    onFinishSelect: _react.PropTypes.func,
    onMouseDown: _react.PropTypes.func,
    onTouchStart: _react.PropTypes.func,
    onClick: _react.PropTypes.func
  }, _class.defaultProps = {
    clickTolerance: 5,
    constantSelect: false,
    selectable: false,
    preserveSelection: false,
    selectIntermediates: false
  }, _class.childContextTypes = {
    registerSelectable: _react.PropTypes.func,
    unregisterSelectable: _react.PropTypes.func,
    selectedNodes: _react.PropTypes.object,
    selectedValues: _react.PropTypes.object
  }, _temp;
}

exports.default = makeSelectable;
module.exports = exports['default'];
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _table = require('./table');

Object.defineProperty(exports, 'Table', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_table).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./table":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
var _scene = scene,
    Component = _scene.Component,
    Container = _scene.Container,
    RectPath = _scene.RectPath,
    Layout = _scene.Layout;


var NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'editor-table',
    label: '',
    name: '',
    property: {
      merge: true,
      split: true
    }
  }, {
    type: 'string',
    label: 'data-key',
    name: 'dataKey',
    property: 'dataKey'
  }, {
    type: 'number',
    label: 'data-index',
    name: 'dataIndex',
    property: 'dataIndex'
  }]
};

var EMPTY_BORDER = {};

function isBottomMost(idx, rows, columns) {
  return idx >= (rows - 1) * columns;
}

function isRightMost(idx, rows, columns) {
  return (idx + 1) % columns == 0;
}

/**
 * 1. 스타일을 상속 받아야 함. (cascade-style)
 * 2. 스타일을 동적처리할 수 있음. (로직처리)
 * 3. 데이타를 받을 수 있음.
 */

var TableCell = function (_RectPath) {
  _inherits(TableCell, _RectPath);

  function TableCell() {
    _classCallCheck(this, TableCell);

    return _possibleConstructorReturn(this, (TableCell.__proto__ || Object.getPrototypeOf(TableCell)).apply(this, arguments));
  }

  _createClass(TableCell, [{
    key: '_drawBorder',
    value: function _drawBorder(context, x, y, to_x, to_y, style) {
      if (style && style.strokeStyle && style.lineWidth && style.lineDash) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(to_x, to_y);
        Component.drawStroke(context, style);
      }
    }
  }, {
    key: '_draw',
    value: function _draw(context) {
      var _model = this.model,
          left = _model.left,
          top = _model.top,
          width = _model.width,
          height = _model.height;


      var border = this.model.border || {};

      // Cell 채우기.
      context.beginPath();
      context.lineWidth = 0;
      context.rect(left, top, width, height);
      this.drawFill(context);

      // Border 그리기
      var parent = this.parent;
      var idx = parent.components.indexOf(this);
      var columns = parent.columns || 1;
      var rows = parent.rows || 1;

      this._drawBorder(context, left, top, left + width, top, border.top);
      this._drawBorder(context, left, top + height, left, top, border.left);
      if (isRightMost(idx, rows, columns)) this._drawBorder(context, left + width, top, left + width, top + height, border.right);
      if (isBottomMost(idx, rows, columns)) this._drawBorder(context, left + width, top + height, left, top + height, border.bottom);
    }

    // get capturable() {
    //   return super.capturable && !this.merged
    // }

    // _post_draw(context) {
    //
    //   this.drawFill(context);
    //
    //   /* 자식 컴포넌트들 그리기 */
    //   var { top, left, scale } = this.model;
    //   context.translate(left, top);
    //
    //   this.layout.drawables(this).forEach(m => {
    //     m.draw(context);
    //   });
    //
    //   context.translate(-left, -top);
    //
    //   this.drawText(context);
    // }

  }, {
    key: 'nature',

    // export default class TableCell extends Container {

    // get layout() {
    //   return Layout.get(this.get('layout') || 'card')
    // }

    get: function get() {
      return NATURE;
    }
  }, {
    key: 'merged',
    set: function set(merged) {
      this.set('merged', !!merged);
      if (merged) this.set('text', '');
    },
    get: function get() {
      return this.get('merged');
    }
  }, {
    key: 'rowspan',
    set: function set(rowspan) {
      this.set('rowspan', rowspan);
    },
    get: function get() {
      return this.get('rowspan');
    }
  }, {
    key: 'colspan',
    set: function set(colspan) {
      this.set('colspan', colspan);
    },
    get: function get() {
      return this.get('colspan');
    }
  }, {
    key: 'border',
    get: function get() {
      var border = this.model.border || EMPTY_BORDER;
    }
  }]);

  return TableCell;
}(RectPath(Component));

exports.default = TableCell;


["border"].forEach(function (getter) {
  return Component.memoize(TableCell.prototype, getter, false);
});

Component.register('table-cell', TableCell);

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tableCell = require('./table-cell');

var _tableCell2 = _interopRequireDefault(_tableCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright © HatioLab Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var _scene = scene,
    Component = _scene.Component,
    Container = _scene.Container,
    Layout = _scene.Layout,
    Model = _scene.Model;


var NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'number',
    label: 'rows',
    name: 'rows',
    property: 'rows'
  }, {
    type: 'number',
    label: 'columns',
    name: 'columns',
    property: 'columns'
  }]
};

var SIDES = {
  all: ['top', 'left', 'bottom', 'right'],
  out: ['top', 'left', 'bottom', 'right'],
  left: ['left'],
  right: ['right'],
  top: ['top'],
  bottom: ['bottom'],
  leftright: ['left', 'right'],
  topbottom: ['top', 'bottom']
};

var CLEAR_STYLE = {
  strokeStyle: '',
  lineDash: 'solid',
  lineWidth: 0
};

var DEFAULT_STYLE = {
  strokeStyle: '#999',
  lineDash: 'solid',
  lineWidth: 1
};

var TABLE_LAYOUT = Layout.get('table');

function hasAnyProperty(o) {
  for (var _len = arguments.length, properties = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  for (var p in properties) {
    if (o.hasOwnProperty(properties[p])) return true;
  }
}

function buildNewCell(app) {
  return Model.compile({
    type: 'table-cell',
    strokeStyle: 'blue',
    left: 0,
    top: 0,
    width: 1,
    height: 1,
    // fillStyle: 'lightgray',
    // fillStyle: {
    //   type: 'pattern',
    //   image: './images/sample.png',
    //   fitPattern: true
    // },
    textWrap: true,
    border: buildBorderStyle(DEFAULT_STYLE, 'all')
  }, app);
}

function buildCopiedCell(copy, app) {
  var obj = JSON.parse(JSON.stringify(copy));
  delete obj.text;
  return Model.compile(obj, app);
}

function buildBorderStyle(style, where) {
  return (SIDES[where] || []).reduce(function (border, side) {
    border[side] = style;
    return border;
  }, {});
}

function setCellBorder(cell, style, where) {
  if (!cell) return;
  cell.set('border', Object.assign({}, cell.get('border') || {}, buildBorderStyle(style, where)));
}

function isLeftMost(total, columns, indices, i) {
  return i == 0 || !(i % columns) || indices.indexOf(i - 1) == -1;
}

function isRightMost(total, columns, indices, i) {
  return i == total - 1 || i % columns == columns - 1 || indices.indexOf(i + 1) == -1;
}

function isTopMost(total, columns, indices, i) {
  return i < columns || indices.indexOf(i - columns) == -1;
}

function isBottomMost(total, columns, indices, i) {
  return i > total - columns - 1 || indices.indexOf(i + columns) == -1;
}

function above(columns, i) {
  return i - columns;
}

function below(columns, i) {
  return i + columns;
}

function before(columns, i) {
  return !(i % columns) ? -1 : i - 1;
}

function after(columns, i) {
  return !((i + 1) % columns) ? -1 : i + 1;
}

function array(value, size) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(1);
  }return arr;
}

var columnControlHandler = {
  ondragmove: function ondragmove(point, index, component) {
    var _component$textBounds = component.textBounds,
        left = _component$textBounds.left,
        top = _component$textBounds.top,
        width = _component$textBounds.width,
        height = _component$textBounds.height;

    var widths_sum = component.widths_sum;

    var widths = component.widths.slice();

    /* 컨트롤의 원래 위치를 구한다. */
    var origin_pos_unit = widths.slice(0, index + 1).reduce(function (sum, width) {
      return sum + width;
    }, 0);
    var origin_offset = left + origin_pos_unit / widths_sum * width;

    /*
     * point의 좌표는 부모 레이어 기준의 x, y 값이다.
     * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
     * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
     * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
     */
    var transcoorded = component.transcoordP2S(point.x, point.y);
    var diff = transcoorded.x - origin_offset;

    var diff_unit = diff / width * widths_sum;

    var min_width_unit = widths_sum / width * 10; // 10픽셀정도를 최소로

    if (diff_unit < 0) diff_unit = -Math.min(widths[index] - min_width_unit, -diff_unit);else diff_unit = Math.min(widths[index + 1] - min_width_unit, diff_unit);

    widths[index] = Math.round((widths[index] + diff_unit) * 100) / 100;
    widths[index + 1] = Math.round((widths[index + 1] - diff_unit) * 100) / 100;

    component.set('widths', widths);
  }
};

var rowControlHandler = {
  ondragmove: function ondragmove(point, index, component) {
    var _component$textBounds2 = component.textBounds,
        left = _component$textBounds2.left,
        top = _component$textBounds2.top,
        width = _component$textBounds2.width,
        height = _component$textBounds2.height;

    var heights_sum = component.heights_sum;

    var heights = component.heights.slice();

    /* 컨트롤의 원래 위치를 구한다. */
    index -= component.columns - 1;
    var origin_pos_unit = heights.slice(0, index + 1).reduce(function (sum, height) {
      return sum + height;
    }, 0);
    var origin_offset = top + origin_pos_unit / heights_sum * height;

    /*
     * point의 좌표는 부모 레이어 기준의 x, y 값이다.
     * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
     * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
     * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
     */
    var transcoorded = component.transcoordP2S(point.x, point.y);
    var diff = transcoorded.y - origin_offset;

    var diff_unit = diff / height * heights_sum;

    var min_height_unit = heights_sum / height * 10; // 10픽셀정도를 최소로

    if (diff_unit < 0) diff_unit = -Math.min(heights[index] - min_height_unit, -diff_unit);else diff_unit = Math.min(heights[index + 1] - min_height_unit, diff_unit);

    heights[index] = Math.round((heights[index] + diff_unit) * 100) / 100;
    heights[index + 1] = Math.round((heights[index + 1] - diff_unit) * 100) / 100;

    component.set('heights', heights);
  }
};

var Table = function (_Container) {
  _inherits(Table, _Container);

  function Table() {
    _classCallCheck(this, Table);

    return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
  }

  _createClass(Table, [{
    key: 'created',
    value: function created() {
      var tobeSize = this.rows * this.columns;
      var gap = this.size() - tobeSize;

      if (gap == 0) {
        return;
      } else if (gap > 0) {
        var removals = this._components.slice(gap);
        this.remove(removals);
      } else {
        var newbies = [];

        for (var i = 0; i < -gap; i++) {
          newbies.push(buildNewCell(this.app));
        }this.add(newbies);
      }

      var widths = this.get('widths');
      var heights = this.get('heights');

      if (!widths || widths.length < this.columns) this.set('widths', this.widths);
      if (!heights || heights.length < this.rows) this.set('heights', this.heights);
    }

    // 컴포넌트를 임의로 추가 및 삭제할 수 있는 지를 지정하는 속성임.

  }, {
    key: 'buildCells',
    value: function buildCells(newrows, newcolumns, oldrows, oldcolumns) {
      var _this2 = this;

      if (newrows < oldrows) {
        var removals = this._components.slice(oldcolumns * newrows);

        // 지우려는 셀중에 병합된 셀을 찾는다.
        var mergedCells = [];
        removals.forEach(function (cell) {
          if (cell.merged === true || cell.rowspan > 1 || cell.colspan > 1) mergedCells.push(cell);
        });

        // 병합된 셀 중에서 슈퍼셀을 찾는다.
        if (mergedCells.length > 0) {
          // 부모 셀을 저장
          var superCells = [];
          // 부모 셀의 인덱스를 저장
          var superCellIndexes = [];
          mergedCells.forEach(function (cell) {
            var col = void 0,
                row = void 0,
                index = void 0;
            col = _this2.components.indexOf(cell) % oldcolumns;
            row = Math.floor(_this2.components.indexOf(cell) / oldcolumns);
            index = row * oldcolumns + col + 1;
            while (index) {
              --index;
              var component = _this2.components[index];
              // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
              if (component.rowspan > 1 || component.colspan > 1) {
                var spColStart = _this2.components.indexOf(component) % oldcolumns;
                var spColEnd = _this2.components.indexOf(component) % oldcolumns + component.colspan;
                var spRowStart = Math.floor(_this2.components.indexOf(component) / oldcolumns);
                var spRowEnd = Math.floor(_this2.components.indexOf(component) / oldcolumns) + component.rowspan;
                // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                  if (-1 == superCellIndexes.indexOf(index)) {
                    superCellIndexes.push(index);
                    superCells.push(component);
                  }
                }
              }
            }
          });
          // 슈퍼셀에서 colspan 을 감소시킨다
          superCells.forEach(function (cell) {
            // newcolumns < oldcolumns 케이스와 이 부분만 다름
            cell.rowspan -= oldrows - newrows;
          });
        }

        this.remove(removals);
      }

      var minrows = Math.min(newrows, oldrows);

      if (newcolumns > oldcolumns) {
        for (var r = 0; r < minrows; r++) {
          for (var c = oldcolumns; c < newcolumns; c++) {
            this.insertComponentAt(buildNewCell(this.app), r * newcolumns + c);
          }
        }
      } else if (newcolumns < oldcolumns) {
        var _removals = [];

        for (var _r = 0; _r < minrows; _r++) {
          for (var _c = newcolumns; _c < oldcolumns; _c++) {
            _removals.push(this.components[_r * oldcolumns + _c]);
          }
        }
        // 지우려는 셀중에 병합된 셀을 찾는다.
        var _mergedCells = [];
        _removals.forEach(function (cell) {
          if (cell.merged === true || cell.rowspan > 1 || cell.colspan > 1) _mergedCells.push(cell);
        });

        // 병합된 셀 중에서 슈퍼셀을 찾는다.
        if (_mergedCells.length > 0) {
          // 부모 셀을 저장
          var _superCells = [];
          // 부모 셀의 인덱스를 저장
          var _superCellIndexes = [];
          _mergedCells.forEach(function (cell) {
            var col = void 0,
                row = void 0,
                index = void 0;
            col = _this2.components.indexOf(cell) % oldcolumns;
            row = Math.floor(_this2.components.indexOf(cell) / oldcolumns);
            index = row * oldcolumns + col + 1;
            while (index) {
              --index;
              var component = _this2.components[index];
              // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
              if (component.rowspan > 1 || component.colspan > 1) {
                var spColStart = _this2.components.indexOf(component) % oldcolumns;
                var spColEnd = _this2.components.indexOf(component) % oldcolumns + component.colspan;
                var spRowStart = Math.floor(_this2.components.indexOf(component) / oldcolumns);
                var spRowEnd = Math.floor(_this2.components.indexOf(component) / oldcolumns) + component.rowspan;
                // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                  if (-1 == _superCellIndexes.indexOf(index)) {
                    _superCellIndexes.push(index);
                    _superCells.push(component);
                  }
                }
              }
            }
          });
          // 슈퍼셀에서 colspan 을 감소시킨다
          _superCells.forEach(function (cell) {
            cell.colspan -= oldcolumns - newcolumns;
          });
        }

        this.remove(_removals);
      }

      if (newrows > oldrows) {
        var newbies = [];

        for (var _r2 = oldrows; _r2 < newrows; _r2++) {
          for (var i = 0; i < newcolumns; i++) {
            newbies.push(buildNewCell(this.app));
          }
        }
        this.add(newbies);
      }

      this.set({
        widths: this.widths,
        heights: this.heights
      });
    }
  }, {
    key: 'setCellsStyle',
    value: function setCellsStyle(cells, style, where) {
      var _this3 = this;

      var components = this.components;
      var total = components.length;
      var columns = this.get('columns');

      // 병합된 셀도 포함시킨다.
      var _cells = [];
      cells.forEach(function (c) {
        _cells.push(c);
        if (c.colspan || c.rowspan) {
          var col = _this3.getRowColumn(c).column;
          var row = _this3.getRowColumn(c).row;
          for (var i = row; i < row + c.rowspan; i++) {
            for (var j = col; j < col + c.colspan; j++) {
              if (i != row || j != col) _cells.push(_this3.components[i * _this3.columns + j]);
            }
          }
        }
      });
      var indices = _cells.map(function (cell) {
        return components.indexOf(cell);
      });
      indices.forEach(function (i) {
        var cell = components[i];

        switch (where) {
          case 'all':
            setCellBorder(cell, style, where);

            if (isLeftMost(total, columns, indices, i)) setCellBorder(components[before(columns, i)], style, 'right');
            if (isRightMost(total, columns, indices, i)) setCellBorder(components[after(columns, i)], style, 'left');
            if (isTopMost(total, columns, indices, i)) setCellBorder(components[above(columns, i)], style, 'bottom');
            if (isBottomMost(total, columns, indices, i)) setCellBorder(components[below(columns, i)], style, 'top');
            break;
          case 'in':
            if (!isLeftMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'left');
            }
            if (!isRightMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'right');
            }
            if (!isTopMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'top');
            }
            if (!isBottomMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'bottom');
            }
            break;
          case 'out':
            if (isLeftMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'left');
              setCellBorder(components[before(columns, i)], style, 'right');
            }
            if (isRightMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'right');
              setCellBorder(components[after(columns, i)], style, 'left');
            }
            if (isTopMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'top');
              setCellBorder(components[above(columns, i)], style, 'bottom');
            }
            if (isBottomMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'bottom');
              setCellBorder(components[below(columns, i)], style, 'top');
            }
            break;
          case 'left':
            if (isLeftMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'left');
              setCellBorder(components[before(columns, i)], style, 'right');
            }
            break;
          case 'right':
            if (isRightMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'right');
              setCellBorder(components[after(columns, i)], style, 'left');
            }
            break;
          case 'center':
            if (!isLeftMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'left');
            }
            if (!isRightMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'right');
            }
            break;
          case 'middle':
            if (!isTopMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'top');
            }
            if (!isBottomMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'bottom');
            }
            break;
          case 'top':
            if (isTopMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'top');
              setCellBorder(components[above(columns, i)], style, 'bottom');
            }
            break;
          case 'bottom':
            if (isBottomMost(total, columns, indices, i)) {
              setCellBorder(cell, style, 'bottom');
              setCellBorder(components[below(columns, i)], style, 'top');
            }
            break;
          case 'clear':
            setCellBorder(cell, CLEAR_STYLE, 'all');

            if (isLeftMost(total, columns, indices, i)) setCellBorder(components[before(columns, i)], CLEAR_STYLE, 'right');
            if (isRightMost(total, columns, indices, i)) setCellBorder(components[after(columns, i)], CLEAR_STYLE, 'left');
            if (isTopMost(total, columns, indices, i)) setCellBorder(components[above(columns, i)], CLEAR_STYLE, 'bottom');
            if (isBottomMost(total, columns, indices, i)) setCellBorder(components[below(columns, i)], CLEAR_STYLE, 'top');
        }
      });
    }
  }, {
    key: 'setCellsData',
    value: function setCellsData() {
      var data = this.data;

      if (!data) return;

      data = this.toObjectArrayValue(data) || [];

      var cells = this.components;
      var columns = this.get('columns');

      cells.forEach(function (cell) {
        var dataKey = cell.model.dataKey;
        var dataIndex = cell.model.dataIndex;
        if (dataKey && dataIndex >= 0) cell.value = (data[dataIndex] || {})[dataKey];
      });
    }
  }, {
    key: 'getRowColumn',
    value: function getRowColumn(cell) {
      var idx = this.components.indexOf(cell);
      var length = this.components.length;

      return {
        column: idx % this.columns,
        row: Math.floor(idx / this.columns)
      };
    }
  }, {
    key: 'getCellsByRow',
    value: function getCellsByRow(row) {
      return this.components.slice(row * this.columns, (row + 1) * this.columns);
    }
  }, {
    key: 'getCellsByColumn',
    value: function getCellsByColumn(column) {
      var cells = [];
      for (var i = 0; i < this.rows; i++) {
        cells.push(this.components[this.columns * i + column]);
      }return cells;
    }

    // 한 개의 행을 매개변수로 받아서 첫 번째 셀부터 우측으로 이동하면서 병합된 셀이 있는지 검사한다.

  }, {
    key: 'findMergedCellByX',
    value: function findMergedCellByX(row) {
      var mergedCells = [];
      var cell = void 0;
      for (var i = 0; i < this.columns; i++) {
        cell = this.components[row * this.columns + i];
        if (cell.merged === true || cell.rowspan > 1 || cell.colspan > 1) mergedCells.push(cell);
      }
      return mergedCells;
    }

    // 한 개의 열을 매개변수로 받아서 첫 번째 셀부터 아래로 이동하면서 병합된 셀이 있는지 검사한다.

  }, {
    key: 'findMergedCellByY',
    value: function findMergedCellByY(column) {
      var mergedCells = [];
      var cell = void 0;
      for (var i = 0; i < this.rows; i++) {
        cell = this.components[i * this.columns + column];
        if (cell.merged === true || cell.rowspan > 1 || cell.colspan > 1) mergedCells.push(cell);
      }
      return mergedCells;
    }
  }, {
    key: 'mergeCells',
    value: function mergeCells(cells) {
      var _this4 = this;

      // 선택한 셀이 들어있는 행
      var mergeableRows = [];
      cells.forEach(function (cell) {
        var row = _this4.getRowColumn(cell).row;
        if (-1 == mergeableRows.indexOf(row)) mergeableRows.push(row);
      });

      // 선택한 셀의 행이 연속적인 숫자가 아니라면 병합하지 않는다.
      if (mergeableRows.length - 1 !== mergeableRows[mergeableRows.length - 1] - mergeableRows[0]) return false;

      // 선택한 셀이 들어있는 열
      var mergeableColumns = [];
      cells.forEach(function (cell) {
        var column = _this4.getRowColumn(cell).column;
        if (-1 == mergeableColumns.indexOf(column)) mergeableColumns.push(column);
      });

      // 선택한 셀의 열이 연속적인 숫자가 아니라면 병합하지 않는다.
      if (mergeableColumns.length - 1 !== mergeableColumns[mergeableColumns.length - 1] - mergeableColumns[0]) return false;

      // 병합할 행의 수
      var numberOfRows = mergeableRows.length;

      // 병합할 열의 수
      var numberOfColumns = mergeableColumns.length;

      // 선택된 셀의 수
      var numberOfCells = cells.length;

      // 병합될 조건 검사
      // 행과 열의 곱이 셀의 수가 아니거나 셀의 수가 2보다 작은 경우는 병합하지 않는다.
      if (numberOfCells !== numberOfRows * numberOfColumns || numberOfCells < 2) return false;

      // 선택한 셀들을 index 값이 낮은 것부터 순서대로 재정렬
      cells.sort(function (a, b) {
        return _this4.getRowColumn(a).row * _this4.columns + _this4.getRowColumn(a).column - (_this4.getRowColumn(b).row * _this4.columns + _this4.getRowColumn(b).column);
      });

      // 셀을 병합함
      var firstCell = cells[0];
      firstCell.set({
        colspan: numberOfColumns,
        rowspan: numberOfRows
      });

      // 첫 번째 셀을 제외한 나머지 셀을 true로 지정
      for (var i = 1; i < numberOfCells; i++) {
        cells[i].merged = true;
      } // 병합 후에는 첫 번째 셀을 선택하도록 함
      this.root.selected = [firstCell];
    }
  }, {
    key: 'splitCells',
    value: function splitCells(cells) {
      // 선택한 병합된 셀의 정보를 가져온다.
      var firstCellRowColumn = this.getRowColumn(cells[0]);
      var firstCell = cells[0];
      var firstCellIndex = this.components.indexOf(cells[0]);
      var length = this.components.length;
      var lastCell = this.components[length - 1];
      var lastCellRowColumn = this.getRowColumn(lastCell);
      var startIndex = length / (lastCellRowColumn.row + 1);

      // 병합된 셀들을 구해서 merged를 false로 설정한다.
      // 자식 셀이 갖고 있는 부모 셀의 위치를 초기화 한다.
      for (var j = 0; j < firstCell.rowspan; j++) {
        var index = void 0;
        var nextCell = void 0;
        for (var i = firstCellIndex; i < firstCellIndex + firstCell.colspan; i++) {
          index = startIndex * j + i;
          nextCell = this.components[index];
          nextCell.merged = false;
        }
      }

      // 첫 번째 셀의 rowspan, colspan = 1로 지정한다.
      firstCell.colspan = 1;
      firstCell.rowspan = 1;
    }
  }, {
    key: 'deleteRows',
    value: function deleteRows(cells) {
      var _this5 = this;

      // 만약 선택한 셀이 병합된 셀이라면 삭제하지 않는다.
      if (cells[0].merged == true) return false;
      // 먼저 cells 위치의 행을 구한다.
      var rows = [];
      cells.forEach(function (cell) {
        var row = _this5.getRowColumn(cell).row;
        if (-1 == rows.indexOf(row)) rows.push(row);
      });
      rows.sort(function (a, b) {
        return a - b;
      });
      rows.reverse();
      var heights = this.heights.slice();
      rows.forEach(function (row) {
        // rows에서 가로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this5.findMergedCellByX(row);
        // mergedCells.length가 0이면 일반적으로 행을 지운다.
        if (mergedCells.length === 0) {
          _this5.remove(_this5.getCellsByRow(row));
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 행을 지워야 한다.
        //
        else {
            // 삭제할 행에서 병합된 셀을 삭제할 때 해당 셀을 임시로 저장
            var temp = [];
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스 값을 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this5.getRowColumn(cell).column;
              row = _this5.getRowColumn(cell).row;
              index = row * _this5.columns + col + 1;
              while (index) {
                --index;
                var component = _this5.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this5.getRowColumn(component).column;
                  var spColEnd = _this5.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this5.getRowColumn(component).row;
                  var spRowEnd = _this5.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              var superCellRow = Math.floor(index / _this5.columns);
              // 지우려는 행이 슈퍼셀을 포함한 경우이면서 슈퍼셀이 마지막 행의 셀이 아닌 경우
              // 그리고 슈퍼셀의 rowspan이 1보다 큰 경우
              if (row === superCellRow && superCellRow !== _this5.rows - 1 && _this5.components[index].rowspan > 1) {
                _this5.components[index + _this5.columns].rowspan = _this5.components[index].rowspan - 1;
                _this5.components[index + _this5.columns].colspan = _this5.components[index].colspan;
                _this5.components[index + _this5.columns].merged = false;
                _this5.components[index + _this5.columns].set('text', _this5.components[index].get('text'));
              } else {
                _this5.components[index].rowspan -= 1;
              }
            });
            _this5.remove(_this5.getCellsByRow(row));
          }
      });
      heights.splice(rows, 1);
      this.model.rows -= rows.length; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.
      this.set('heights', heights);
    }
  }, {
    key: 'deleteColumns',
    value: function deleteColumns(cells) {
      var _this6 = this;

      // 만약 선택한 셀이 병합된 셀이라면 삭제하지 않는다.
      if (cells[0].merged == true) return false;
      // 먼저 cells 위치의 열을 구한다.
      var columns = [];
      cells.forEach(function (cell) {
        var column = _this6.getRowColumn(cell).column;
        if (-1 == columns.indexOf(column)) columns.push(column);
      });
      columns.sort(function (a, b) {
        return a - b;
      });
      columns.reverse();

      columns.forEach(function (column) {
        var widths = _this6.widths.slice();
        // columns에서 세로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this6.findMergedCellByY(column);
        // mergedCells.length가 0이면 일반적으로 열을 지운다.
        if (mergedCells.length === 0) {
          _this6.remove(_this6.getCellsByColumn(column));
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 열을 지워야 한다.
        else {
            // 삭제할 열에서 병합된 셀을 삭제할 때 해당 셀을 임시로 저장
            var temp = [];
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스를 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this6.getRowColumn(cell).column;
              row = _this6.getRowColumn(cell).row;
              index = row * _this6.columns + col + 1;
              while (index) {
                --index;
                var component = _this6.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this6.getRowColumn(component).column;
                  var spColEnd = _this6.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this6.getRowColumn(component).row;
                  var spRowEnd = _this6.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              var superCellColumn = index % _this6.columns;
              // 지우려는 열이 슈퍼셀을 포함한 경우이면서 슈퍼셀이 마지막 열의 셀이 아닌 경우
              // 그리고 슈퍼셀의 colspan이 1보다 큰 경우
              if (column === superCellColumn && superCellColumn !== _this6.columns - 1 && _this6.components[index].colspan > 1) {
                _this6.components[index + 1].rowspan = _this6.components[index].rowspan;
                _this6.components[index + 1].colspan = _this6.components[index].colspan - 1;
                _this6.components[index + 1].merged = false;
                _this6.components[index + 1].set('text', _this6.components[index].get('text'));
              } else {
                _this6.components[index].colspan -= 1;
              }
            });
            _this6.remove(_this6.getCellsByColumn(column));
          }
        widths.splice(column, 1);
        _this6.model.columns -= 1; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.
        _this6.set('widths', widths);
      });
    }
  }, {
    key: 'insertCellsAbove',
    value: function insertCellsAbove(cells) {
      var _this7 = this;

      // 먼저 cells 위치의 행을 구한다.
      var rows = [];
      cells.forEach(function (cell) {
        var row = _this7.getRowColumn(cell).row;
        if (-1 == rows.indexOf(row)) rows.push(row);
      });
      rows.sort(function (a, b) {
        return a - b;
      });
      rows.reverse();
      // 행 2개 이상은 추가 안함. 임시로 막아놓음
      if (rows.length >= 2) return false;
      var insertionRowPosition = rows[0];
      var newbieRowHeights = [];
      var newbieCells = [];
      rows.forEach(function (row) {
        // rows에서 가로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this7.findMergedCellByX(row);
        // mergedCells.length가 0이면 일반적으로 행을 위에 추가한다.
        if (mergedCells.length === 0) {
          for (var i = 0; i < _this7.columns; i++) {
            newbieCells.push(buildCopiedCell(_this7.components[row * _this7.columns + i].model, _this7.app));
          }newbieRowHeights.push(_this7.heights[row]);

          newbieCells.reverse().forEach(function (cell) {
            _this7.insertComponentAt(cell, insertionRowPosition * _this7.columns);
          });

          var heights = _this7.heights.slice();
          heights.splice.apply(heights, [insertionRowPosition, 0].concat(newbieRowHeights));
          _this7.set('heights', heights);

          _this7.model.rows += rows.length;

          _this7.clearCache();
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 행을 추가해야 한다.
        else {
            // 선택한 행이 2개 이상 있고 그 중에 병합된 셀이 적어도 한 개라도 있으면
            // 병합된 셀이 포함된 행의 추가는 무시한다. 임시방편으로 막아놈
            if (rows.length > 1) return false;
            // 추가할 행에서 병합된 셀을 추가할 때 해당 셀을 임시로 저장
            var temp = [];
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스 값을 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this7.getRowColumn(cell).column;
              row = _this7.getRowColumn(cell).row;
              index = row * _this7.columns + col + 1;
              while (index) {
                --index;
                var component = _this7.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this7.getRowColumn(component).column;
                  var spColEnd = _this7.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this7.getRowColumn(component).row;
                  var spRowEnd = _this7.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              // 추가하려는 셀은 일반 셀인데 그 위치에 다른 병합된 셀이 있는 문제로 임시로 막아 놓음. 수정해야함
              if (superCellIndexes.length >= 2) return false;
              var superCellRow = Math.floor(index / _this7.columns);
              var superCellObj = {
                rowspan: _this7.components[index].rowspan,
                colspan: _this7.components[index].colspan,
                text: _this7.components[index].get('text'),
                merged: _this7.components[index].merged
                // 추가하려는 행이 슈퍼셀을 포함한 경우
              };if (superCellRow === row) {
                for (var _i = 0; _i < _this7.columns; _i++) {
                  newbieCells.push(buildNewCell(_this7.app));
                }newbieRowHeights.push(_this7.heights[row]);

                newbieCells.reverse().forEach(function (cell) {
                  _this7.insertComponentAt(cell, insertionRowPosition * _this7.columns);
                });
                _this7.components[index + _this7.columns].rowspan = superCellObj.rowspan;
                _this7.components[index + _this7.columns].colspan = superCellObj.colspan;
                _this7.components[index + _this7.columns].set('text', superCellObj.text);
                _this7.components[index + _this7.columns].merged = superCellObj.merged;
              } else {
                for (var _i2 = 0; _i2 < _this7.columns; _i2++) {
                  newbieCells.push(buildCopiedCell(_this7.components[row * _this7.columns + _i2].model, _this7.app));
                }newbieRowHeights.push(_this7.heights[row]);

                newbieCells.reverse().forEach(function (cell) {
                  _this7.insertComponentAt(cell, insertionRowPosition * _this7.columns);
                });
                _this7.components[index].rowspan += 1;
              }
              var heights = _this7.heights.slice();
              heights.splice.apply(heights, [insertionRowPosition, 0].concat(newbieRowHeights));
              _this7.set('heights', heights);

              _this7.model.rows += rows.length;

              _this7.clearCache();
            });
          }
      });
    }
  }, {
    key: 'insertCellsBelow',
    value: function insertCellsBelow(cells) {
      var _this8 = this;

      // 먼저 cells 위치의 행을 구한다.
      var rows = [];
      cells.forEach(function (cell) {
        var row = _this8.getRowColumn(cell).row;
        if (-1 == rows.indexOf(row)) rows.push(row);
      });
      rows.sort(function (a, b) {
        return a - b;
      });
      rows.reverse();
      // 행 2개 이상은 추가 안함. 임시로 막아놓음
      if (rows.length >= 2) return false;
      var insertionRowPosition = rows[rows.length - 1] + 1;
      var newbieRowHeights = [];
      var newbieCells = [];
      rows.forEach(function (row) {
        // rows에서 가로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this8.findMergedCellByX(row);
        // mergedCells.length가 0이면 일반적으로 행을 아래에 추가한다.
        if (mergedCells.length === 0) {
          for (var i = 0; i < _this8.columns; i++) {
            newbieCells.push(buildCopiedCell(_this8.components[row * _this8.columns + i].model, _this8.app));
          }newbieRowHeights.push(_this8.heights[row]);

          newbieCells.reverse().forEach(function (cell) {
            _this8.insertComponentAt(cell, insertionRowPosition * _this8.columns);
          });

          var heights = _this8.heights.slice();
          heights.splice.apply(heights, [insertionRowPosition, 0].concat(newbieRowHeights));
          _this8.set('heights', heights);

          _this8.model.rows += 1;

          _this8.clearCache();
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 행을 추가해야 한다.
        else {
            // 추가할 행에서 병합된 셀을 추가할 때 해당 셀을 임시로 저장
            var temp = [];
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스 값을 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this8.getRowColumn(cell).column;
              row = _this8.getRowColumn(cell).row;
              index = row * _this8.columns + col + 1;
              while (index) {
                --index;
                var component = _this8.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this8.getRowColumn(component).column;
                  var spColEnd = _this8.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this8.getRowColumn(component).row;
                  var spRowEnd = _this8.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              // 추가하려는 셀은 일반 셀인데 그 위치에 다른 병합된 셀이 있는 문제로 임시로 막아 놓음. 수정해야함
              if (superCellIndexes.length >= 2) return false;
              var superCellRow = Math.floor(index / _this8.columns);
              var superCellObj = {
                rowspan: _this8.components[index].rowspan,
                colspan: _this8.components[index].colspan,
                text: _this8.components[index].get('text'),
                merged: _this8.components[index].merged
                // 추가하려는 행이 병합된 셀중 마지막 행인 경우
              };if (superCellRow + superCellObj.rowspan - 1 === row) {
                for (var _i3 = 0; _i3 < _this8.columns; _i3++) {
                  newbieCells.push(buildNewCell(_this8.app));
                }newbieRowHeights.push(_this8.heights[row]);

                newbieCells.reverse().forEach(function (cell) {
                  _this8.insertComponentAt(cell, insertionRowPosition * _this8.columns);
                });
              } else if (superCellRow === row) {
                for (var _i4 = 0; _i4 < _this8.columns; _i4++) {
                  newbieCells.push(buildCopiedCell(_this8.components[row * _this8.columns + _i4].model, _this8.app));
                }newbieRowHeights.push(_this8.heights[row]);

                newbieCells.reverse().forEach(function (cell) {
                  _this8.insertComponentAt(cell, insertionRowPosition * _this8.columns);
                });
                _this8.components[index].rowspan += 1;
                // 슈퍼셀이 복사됐으므로 그 해당 셀을 병합된 셀로 설정한다.
                _this8.components[index + _this8.columns].rowspan = 1;
                _this8.components[index + _this8.columns].colspan = 1;
                _this8.components[index + _this8.columns].merged = true;
                _this8.components[index + _this8.columns].set('text', '');
              } else {
                for (var _i5 = 0; _i5 < _this8.columns; _i5++) {
                  newbieCells.push(buildCopiedCell(_this8.components[row * _this8.columns + _i5].model, _this8.app));
                }newbieRowHeights.push(_this8.heights[row]);

                newbieCells.reverse().forEach(function (cell) {
                  _this8.insertComponentAt(cell, insertionRowPosition * _this8.columns);
                });
                _this8.components[index].rowspan += 1;
              }
              var heights = _this8.heights.slice();
              heights.splice.apply(heights, [insertionRowPosition, 0].concat(newbieRowHeights));
              _this8.set('heights', heights);

              _this8.model.rows += 1;

              _this8.clearCache();
            });
          }
      });
    }
  }, {
    key: 'insertCellsLeft',
    value: function insertCellsLeft(cells) {
      var _this9 = this;

      // 먼저 cells 위치의 열을 구한다.
      var columns = [];
      cells.forEach(function (cell) {
        var column = _this9.getRowColumn(cell).column;
        if (-1 == columns.indexOf(column)) columns.push(column);
      });
      columns.sort(function (a, b) {
        return a - b;
      });
      columns.reverse();
      // 열 2개 이상은 추가 안함. 임시로 막아놓음
      if (columns.length >= 2) return false;
      var insertionColumnPosition = columns[0];
      var newbieColumnWidths = [];
      var newbieCells = [];
      columns.forEach(function (column) {
        // columns에서 세로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this9.findMergedCellByY(column);
        // mergedCells.length가 0이면 일반적으로 열을 왼쪽에 추가한다.
        if (mergedCells.length === 0) {
          for (var i = 0; i < _this9.rows; i++) {
            newbieCells.push(buildCopiedCell(_this9.components[column + _this9.columns * i].model, _this9.app));
          }newbieColumnWidths.push(_this9.widths[column]);

          var increasedColumns = _this9.columns;
          var index = _this9.rows;
          newbieCells.reverse().forEach(function (cell) {
            if (index == 0) {
              index = _this9.rows;
              increasedColumns++;
            }

            index--;
            _this9.insertComponentAt(cell, insertionColumnPosition + index * increasedColumns);
          });

          var widths = _this9.widths.slice();
          _this9.model.columns += columns.length; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

          widths.splice.apply(widths, [insertionColumnPosition, 0].concat(newbieColumnWidths));

          _this9.set('widths', widths);
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 열을 추가해야 한다.
        else {
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스 값을 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this9.getRowColumn(cell).column;
              row = _this9.getRowColumn(cell).row;
              index = row * _this9.columns + col + 1;
              while (index) {
                --index;
                var component = _this9.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this9.getRowColumn(component).column;
                  var spColEnd = _this9.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this9.getRowColumn(component).row;
                  var spRowEnd = _this9.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              // 추가하려는 셀은 일반 셀인데 그 위치에 다른 병합된 셀이 있는 문제로 임시로 막아 놓음. 수정해야함
              if (superCellIndexes.length >= 2) return false;
              var superCellColumn = index % _this9.columns;
              var superCellObj = {
                rowspan: _this9.components[index].rowspan,
                colspan: _this9.components[index].colspan,
                text: _this9.components[index].get('text'),
                merged: _this9.components[index].merged
                // 추가하려는 열이 슈퍼셀을 포함한 경우
              };if (superCellColumn === column) {
                for (var _i6 = 0; _i6 < _this9.rows; _i6++) {
                  newbieCells.push(buildNewCell(_this9.app));
                }newbieColumnWidths.push(_this9.widths[column]);

                var _increasedColumns = _this9.columns;
                var rowIndex = _this9.rows;
                newbieCells.reverse().forEach(function (cell) {
                  if (rowIndex == 0) {
                    rowIndex = _this9.rows;
                    _increasedColumns++;
                  }

                  rowIndex--;
                  _this9.insertComponentAt(cell, insertionColumnPosition + rowIndex * _increasedColumns);
                });
              } else {
                _this9.components[index].colspan += 1;
                for (var _i7 = 0; _i7 < _this9.rows; _i7++) {
                  newbieCells.push(buildCopiedCell(_this9.components[column + _this9.columns * _i7].model, _this9.app));
                }newbieColumnWidths.push(_this9.widths[column]);

                var _increasedColumns2 = _this9.columns;
                var _rowIndex = _this9.rows;
                newbieCells.reverse().forEach(function (cell) {
                  if (_rowIndex == 0) {
                    _rowIndex = _this9.rows;
                    _increasedColumns2++;
                  }

                  _rowIndex--;
                  _this9.insertComponentAt(cell, insertionColumnPosition + _rowIndex * _increasedColumns2);
                });
              }
              var widths = _this9.widths.slice();
              _this9.model.columns += columns.length; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

              widths.splice.apply(widths, [insertionColumnPosition, 0].concat(newbieColumnWidths));

              _this9.set('widths', widths);
            });
          }
      });
    }
  }, {
    key: 'insertCellsRight',
    value: function insertCellsRight(cells) {
      var _this10 = this;

      // 먼저 cells 위치의 열을 구한다.
      var columns = [];
      cells.forEach(function (cell) {
        var column = _this10.getRowColumn(cell).column;
        if (-1 == columns.indexOf(column)) columns.push(column);
      });
      columns.sort(function (a, b) {
        return a - b;
      });
      columns.reverse();
      // 열 2개 이상은 추가 안함. 임시로 막아놓음
      if (columns.length >= 2) return false;
      var insertionColumnPosition = columns[columns.length - 1] + 1;
      var newbieColumnWidths = [];
      var newbieCells = [];
      columns.forEach(function (column) {
        // columns에서 세로 방향으로 이동하면서 병합된 셀을 찾는다.
        var mergedCells = _this10.findMergedCellByY(column);
        // mergedCells.length가 0이면 일반적으로 열을 오른쪽에 추가한다.
        if (mergedCells.length === 0) {
          for (var i = 0; i < _this10.rows; i++) {
            newbieCells.push(buildCopiedCell(_this10.components[column + _this10.columns * i].model, _this10.app));
          }newbieColumnWidths.push(_this10.widths[column]);

          var increasedColumns = _this10.columns;
          var index = _this10.rows;
          newbieCells.reverse().forEach(function (cell) {
            if (index == 0) {
              index = _this10.rows;
              increasedColumns++;
            }

            index--;
            _this10.insertComponentAt(cell, insertionColumnPosition + index * increasedColumns);
          });

          var widths = _this10.widths.slice();
          _this10.model.columns += columns.length; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

          widths.splice.apply(widths, [insertionColumnPosition, 0].concat(newbieColumnWidths));

          _this10.set('widths', widths);
        }
        // mergedCells.length가 0이 아니면 병합된 셀을 고려하여 열을 추가해야 한다.
        else {
            // 부모 셀을 저장
            var superCells = [];
            // 부모 셀의 인덱스 값을 저장
            var superCellIndexes = [];
            mergedCells.forEach(function (cell) {
              var col = void 0,
                  row = void 0,
                  index = void 0;
              col = _this10.getRowColumn(cell).column;
              row = _this10.getRowColumn(cell).row;
              index = row * _this10.columns + col + 1;
              while (index) {
                --index;
                var component = _this10.components[index];
                // 슈퍼셀을 찾고 슈퍼셀의 위치에서 rowspan, colspan 거리만큼 이동하면서 cell이 있는지 검증해야함
                if (component.rowspan > 1 || component.colspan > 1) {
                  var spColStart = _this10.getRowColumn(component).column;
                  var spColEnd = _this10.getRowColumn(component).column + component.colspan;
                  var spRowStart = _this10.getRowColumn(component).row;
                  var spRowEnd = _this10.getRowColumn(component).row + component.rowspan;
                  // 슈퍼셀 영역 안에 자식 셀이 있으면 superCells에 부모셀을 추가
                  if (col >= spColStart && col < spColEnd && row >= spRowStart && row < spRowEnd) {
                    if (-1 == superCellIndexes.indexOf(index)) {
                      superCellIndexes.push(index);
                      superCells.push(component);
                    }
                  }
                }
              }
            });
            superCellIndexes.forEach(function (index) {
              // 추가하려는 셀은 일반 셀인데 그 위치에 다른 병합된 셀이 있는 문제로 임시로 막아 놓음. 수정해야함
              if (superCellIndexes.length >= 2) return false;
              var superCellRow = Math.floor(index / _this10.columns);
              var superCellColumn = index % _this10.columns;
              var superCellObj = {
                rowspan: _this10.components[index].rowspan,
                colspan: _this10.components[index].colspan,
                text: _this10.components[index].get('text'),
                merged: _this10.components[index].merged
                // 추가하려는 열이 병합된 셀중 마지막 열인 경우
              };if (superCellColumn + superCellObj.colspan - 1 === column) {
                for (var _i8 = 0; _i8 < _this10.rows; _i8++) {
                  newbieCells.push(buildNewCell(_this10.app));
                }newbieColumnWidths.push(_this10.widths[column]);

                var _increasedColumns3 = _this10.columns;
                var rowIndex = _this10.rows;
                newbieCells.reverse().forEach(function (cell) {
                  if (rowIndex == 0) {
                    rowIndex = _this10.rows;
                    _increasedColumns3++;
                  }

                  rowIndex--;
                  _this10.insertComponentAt(cell, insertionColumnPosition + rowIndex * _increasedColumns3);
                });
              } else if (superCellColumn === column) {
                _this10.components[index].colspan += 1;
                for (var _i9 = 0; _i9 < _this10.rows; _i9++) {
                  newbieCells.push(buildCopiedCell(_this10.components[column + _this10.columns * _i9].model, _this10.app));
                }newbieColumnWidths.push(_this10.widths[column]);

                var _increasedColumns4 = _this10.columns;
                var _rowIndex2 = _this10.rows;
                newbieCells.reverse().forEach(function (cell) {
                  if (_rowIndex2 == 0) {
                    _rowIndex2 = _this10.rows;
                    _increasedColumns4++;
                  }

                  _rowIndex2--;
                  _this10.insertComponentAt(cell, insertionColumnPosition + _rowIndex2 * _increasedColumns4);
                });
                // 슈퍼셀이 복사됐으므로 그 해당 셀을 병합된 셀로 설정한다.
                _this10.components[index + superCellRow + 1].rowspan = 1;
                _this10.components[index + superCellRow + 1].colspan = 1;
                _this10.components[index + superCellRow + 1].merged = true;
                _this10.components[index + superCellRow + 1].set('text', '');
              } else {
                _this10.components[index].colspan += 1;
                for (var _i10 = 0; _i10 < _this10.rows; _i10++) {
                  newbieCells.push(buildCopiedCell(_this10.components[column + _this10.columns * _i10].model, _this10.app));
                }newbieColumnWidths.push(_this10.widths[column]);

                var _increasedColumns5 = _this10.columns;
                var _rowIndex3 = _this10.rows;
                newbieCells.reverse().forEach(function (cell) {
                  if (_rowIndex3 == 0) {
                    _rowIndex3 = _this10.rows;
                    _increasedColumns5++;
                  }

                  _rowIndex3--;
                  _this10.insertComponentAt(cell, insertionColumnPosition + _rowIndex3 * _increasedColumns5);
                });
              }
              var widths = _this10.widths.slice();
              _this10.model.columns += columns.length; // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

              widths.splice.apply(widths, [insertionColumnPosition, 0].concat(newbieColumnWidths));

              _this10.set('widths', widths);
            });
          }
      });
    }
  }, {
    key: 'distributeHorizontal',
    value: function distributeHorizontal(cells) {
      var _this11 = this;

      var columns = [];

      cells.forEach(function (cell) {
        var rowcolumn = _this11.getRowColumn(cell);

        if (-1 == columns.indexOf(rowcolumn.column)) columns.push(rowcolumn.column);
      });

      var sum = columns.reduce(function (sum, column) {
        return sum + _this11.widths[column];
      }, 0);

      var newval = Math.round(sum / columns.length * 100) / 100;
      var widths = this.widths.slice();
      columns.forEach(function (column) {
        widths[column] = newval;
      });

      this.set('widths', widths);
    }
  }, {
    key: 'distributeVertical',
    value: function distributeVertical(cells) {
      var _this12 = this;

      var rows = [];

      cells.forEach(function (cell) {
        var rowcolumn = _this12.getRowColumn(cell);

        if (-1 == rows.indexOf(rowcolumn.row)) rows.push(rowcolumn.row);
      });

      var sum = rows.reduce(function (sum, row) {
        return sum + _this12.heights[row];
      }, 0);

      var newval = Math.round(sum / rows.length * 100) / 100;
      var heights = this.heights.slice();
      rows.forEach(function (row) {
        heights[row] = newval;
      });

      this.set('heights', heights);
    }
  }, {
    key: 'toObjectArrayValue',
    value: function toObjectArrayValue(array) {
      if (!array || array.length === 0) return null;

      if (!array[0].hasOwnProperty('__field1')) {
        return array;
      }

      var indexKeyMap = {};
      var value = [];

      for (var key in array[0]) {
        indexKeyMap[key] = array[0][key];
      }

      for (var i = 1; i < array.length; i++) {
        var object = {};
        var thisObject = array[i];
        for (var _key2 in indexKeyMap) {
          var k = indexKeyMap[_key2];
          var v = thisObject[_key2];
          object[k] = v;
        }

        value.push(object);
      }

      return value;
    }
  }, {
    key: 'onchange',
    value: function onchange(after, before) {
      if (hasAnyProperty(after, "rows", "columns")) {
        this.buildCells(this.get('rows'), this.get('columns'), before.hasOwnProperty('rows') ? before.rows : this.get('rows'), before.hasOwnProperty('columns') ? before.columns : this.get('columns'));
      }

      if (before.data || after.data) {
        this.setCellsData();
      }
    }
  }, {
    key: 'oncellchanged',
    value: function oncellchanged(after, before) {
      if (hasAnyProperty(after, "dataKey", "dataIndex")) {
        this.setCellsData();
      }
    }
  }, {
    key: 'focusible',
    get: function get() {
      return false;
    }
  }, {
    key: 'widths',
    get: function get() {
      var widths = this.get('widths');

      if (!widths) return array(1, this.columns);

      if (widths.length < this.columns) return widths.concat(array(1, this.columns - widths.length));else if (widths.length > this.columns) return widths.slice(0, this.columns);

      return widths;
    }
  }, {
    key: 'heights',
    get: function get() {
      var heights = this.get('heights');

      if (!heights) return array(1, this.rows);

      if (heights.length < this.rows) return heights.concat(array(1, this.rows - heights.length));else if (heights.length > this.rows) return heights.slice(0, this.rows);

      return heights;
    }
  }, {
    key: 'layout',
    get: function get() {
      return TABLE_LAYOUT;
    }
  }, {
    key: 'rows',
    get: function get() {
      return this.get('rows');
    }
  }, {
    key: 'columns',
    get: function get() {
      return this.get('columns');
    }
  }, {
    key: 'lefts',
    get: function get() {
      var _this13 = this;

      return this.components.filter(function (c, i) {
        return !(i % _this13.columns);
      });
    }
  }, {
    key: 'centers',
    get: function get() {
      var _this14 = this;

      return this.components.filter(function (c, i) {
        return i % _this14.columns && (i + 1) % _this14.columns;
      });
    }
  }, {
    key: 'rights',
    get: function get() {
      var _this15 = this;

      return this.components.filter(function (c, i) {
        return !((i + 1) % _this15.columns);
      });
    }
  }, {
    key: 'tops',
    get: function get() {
      return this.components.slice(0, this.columns);
    }
  }, {
    key: 'middles',
    get: function get() {
      return this.components.slice(this.columns, this.columns * (this.rows - 1));
    }
  }, {
    key: 'bottoms',
    get: function get() {
      return this.components.slice(this.columns * (this.rows - 1));
    }
  }, {
    key: 'all',
    get: function get() {
      return this.components;
    }
  }, {
    key: 'widths_sum',
    get: function get() {
      var _this16 = this;

      var widths = this.widths;
      return widths ? widths.filter(function (width, i) {
        return i < _this16.columns;
      }).reduce(function (sum, width) {
        return sum + width;
      }, 0) : this.columns;
    }
  }, {
    key: 'heights_sum',
    get: function get() {
      var _this17 = this;

      var heights = this.heights;
      return heights ? heights.filter(function (height, i) {
        return i < _this17.rows;
      }).reduce(function (sum, height) {
        return sum + height;
      }, 0) : this.rows;
    }
  }, {
    key: 'nature',
    get: function get() {
      return NATURE;
    }
  }, {
    key: 'controls',
    get: function get() {
      var widths = this.widths;
      var heights = this.heights;
      var inside = this.textBounds;

      var width_unit = inside.width / this.widths_sum;
      var height_unit = inside.height / this.heights_sum;

      var x = inside.left;
      var y = inside.top;

      var controls = [];

      widths.slice(0, this.columns - 1).forEach(function (width) {
        x += width * width_unit;
        controls.push({
          x: x,
          y: inside.top,
          handler: columnControlHandler
        });
      });

      heights.slice(0, this.rows - 1).forEach(function (height) {
        y += height * height_unit;
        controls.push({
          x: inside.left,
          y: y,
          handler: rowControlHandler
        });
      });

      return controls;
    }
  }, {
    key: 'eventMap',
    get: function get() {
      return {
        '(self)': {
          '(descendant)': {
            change: this.oncellchanged
          }
        }
      };
    }
  }]);

  return Table;
}(Container);

exports.default = Table;


["rows", "columns", "widths", "heights", "widths_sum", "heights_sum", "controls"].forEach(function (getter) {
  return Component.memoize(Table.prototype, getter, false);
});

Component.register('table', Table);

},{"./table-cell":2}]},{},[1]);

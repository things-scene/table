import TableCell from './table-cell'
import TableLayout from './table-layout'

var {
  Component,
  Container,
  Layout,
  Model
} = scene;

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
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
}

const SIDES = {
  all: ['top', 'left', 'bottom', 'right'],
  out: ['top', 'left', 'bottom', 'right'],
  left: ['left'],
  right: ['right'],
  top: ['top'],
  bottom: ['bottom'],
  leftright: ['left', 'right'],
  topbottom: ['top', 'bottom']
}

const CLEAR_STYLE = {
  strokeStyle: '',
  lineDash: 'solid',
  lineWidth: 0
}

const DEFAULT_STYLE = {
  strokeStyle: '#999',
  lineDash: 'solid',
  lineWidth: 1
}

const TABLE_LAYOUT = Layout.get('table')

function hasAnyProperty(o, ...properties) {
  for(let p in properties) {
    if(o.hasOwnProperty(properties[p]))
      return true
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
  }, app)
}

function buildCopiedCell(copy, app) {
  var obj = JSON.parse(JSON.stringify(copy))
  delete obj.text
  return Model.compile(obj, app)
}

function buildBorderStyle(style, where) {
  return (SIDES[where] || []).reduce((border, side) => {
    border[side] = style
    return border
  }, {})
}

function setCellBorder(cell, style, where) {
  if(!cell)
    return
  cell.set('border', Object.assign({}, cell.get('border') || {}, buildBorderStyle(style, where)))
}

function isLeftMost(total, columns, indices, i) {
  return i == 0 || !(i % columns) || indices.indexOf(i - 1) == -1;
}

function isRightMost(total, columns, indices, i) {
  return i == total - 1 || (i % columns == columns - 1) || indices.indexOf(i + 1) == -1;
}

function isTopMost(total, columns, indices, i) {
  return i < columns || indices.indexOf(i - columns) == -1;
}

function isBottomMost(total, columns, indices, i) {
  return i > (total - columns - 1) || indices.indexOf(i + columns) == -1;
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
  var arr = []
  for(let i = 0;i < size;i++)
    arr.push(1)
  return arr
}

var columnControlHandler = {
  ondragmove: function(point, index, component) {
    var { left, top, width, height } = component.textBounds
    var widths_sum = component.widths_sum

    var widths = component.widths.slice()

    /* 컨트롤의 원래 위치를 구한다. */
    var origin_pos_unit = widths.slice(0, index + 1).reduce((sum, width) => sum + width, 0)
    var origin_offset = left + origin_pos_unit / widths_sum * width

    /*
     * point의 좌표는 부모 레이어 기준의 x, y 값이다.
     * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
     * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
     * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
     */
    var transcoorded = component.transcoordP2S(point.x, point.y)
    var diff = transcoorded.x - origin_offset

    var diff_unit = diff / width * widths_sum

    var min_width_unit = (widths_sum / width) * 10 // 10픽셀정도를 최소로

    if(diff_unit < 0)
      diff_unit = - Math.min(widths[index] - min_width_unit, -diff_unit)
    else
      diff_unit = Math.min(widths[index + 1] - min_width_unit, diff_unit)

    widths[index] = Math.round((widths[index] + diff_unit) * 100) / 100
    widths[index + 1] = Math.round((widths[index + 1] - diff_unit) * 100) / 100

    component.set('widths', widths)
  }
}

var rowControlHandler = {
  ondragmove: function(point, index, component) {
    var { left, top, width, height } = component.textBounds
    var heights_sum = component.heights_sum

    var heights = component.heights.slice()

    /* 컨트롤의 원래 위치를 구한다. */
    index -= component.columns - 1
    var origin_pos_unit = heights.slice(0, index + 1).reduce((sum, height) => sum + height, 0)
    var origin_offset = top + origin_pos_unit / heights_sum * height

    /*
     * point의 좌표는 부모 레이어 기준의 x, y 값이다.
     * 따라서, 도형의 회전을 감안한 좌표로의 변환이 필요하다.
     * Transcoord시에는 point좌표가 부모까지 transcoord되어있는 상태이므로,
     * 컴포넌트자신에 대한 transcoord만 필요하다.(마지막 파라미터를 false로).
     */
    var transcoorded = component.transcoordP2S(point.x, point.y)
    var diff = transcoorded.y - origin_offset

    var diff_unit = diff / height * heights_sum

    var min_height_unit = (heights_sum / height) * 10 // 10픽셀정도를 최소로

    if(diff_unit < 0)
      diff_unit = - Math.min(heights[index] - min_height_unit, -diff_unit)
    else
      diff_unit = Math.min(heights[index + 1] - min_height_unit, diff_unit)

    heights[index] = Math.round((heights[index] + diff_unit) * 100) / 100
    heights[index + 1] = Math.round((heights[index + 1] - diff_unit) * 100) / 100

    component.set('heights', heights)
  }
}

export default class Table extends Container {

  created() {
    var tobeSize = this.rows * this.columns
    var gap = this.size() - tobeSize

    if(gap == 0) {
      return
    } else if(gap > 0) {
      let removals = this._components.slice(gap);
      this.remove(removals);
    } else {
      let newbies = []

      for(let i = 0;i < -gap;i++)
        newbies.push(buildNewCell(this.app));

      this.add(newbies);
    }

    var widths = this.get('widths')
    var heights = this.get('heights')

    if(!widths || widths.length < this.columns)
      this.set('widths', this.widths)
    if(!heights || heights.length < this.rows)
      this.set('heights', this.heights)
  }

  // 컴포넌트를 임의로 추가 및 삭제할 수 있는 지를 지정하는 속성임.
  get focusible() {
    return false
  }

  get widths() {
    var widths = this.get('widths')

    if(!widths)
      return array(1, this.columns)

    if(widths.length < this.columns)
      return widths.concat(array(1, this.columns - widths.length))
    else if(widths.length > this.columns)
      return widths.slice(0, this.columns)

    return widths
  }

  get heights() {
    var heights = this.get('heights')

    if(!heights)
      return array(1, this.rows)

    if(heights.length < this.rows)
      return heights.concat(array(1, this.rows - heights.length))
    else if(heights.length > this.rows)
      return heights.slice(0, this.rows)

    return heights
  }

  buildCells(newrows, newcolumns, oldrows, oldcolumns) {

    if(newrows < oldrows) {
      let removals = this._components.slice(oldcolumns * newrows);
      this.remove(removals);
    }

    var minrows = Math.min(newrows, oldrows)

    if(newcolumns > oldcolumns) {
      for(let r = 0;r < minrows;r++) {
        for(let c = oldcolumns;c < newcolumns;c++) {
          this.insertComponentAt(buildNewCell(this.app), r * newcolumns + c);
        }
      }
    } else if(newcolumns < oldcolumns) {
      let removals = []

      for(let r = 0;r < minrows;r++) {
        for(let c = newcolumns;c < oldcolumns;c++) {
          removals.push(this.components[r * oldcolumns + c])
        }
      }
      this.remove(removals);
    }

    if(newrows > oldrows) {
      let newbies = []

      for(let r = oldrows;r < newrows;r++) {
        for(let i = 0;i < newcolumns;i++) {
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

  get layout() {
    return TABLE_LAYOUT;
  }

  get rows() {
    return this.get('rows')
  }

  setCellsStyle(cells, style, where) {
    var components = this.components;
    var total = components.length;
    var columns = this.get('columns');
    var indices = cells.map(cell => components.indexOf(cell));

    indices.forEach(i => {
      var cell = components[i];

      switch(where) {
      case 'all':
        setCellBorder(cell, style, where);

        if(isLeftMost(total, columns, indices, i))
          setCellBorder(components[before(columns, i)], style, 'right')
        if(isRightMost(total, columns, indices, i))
          setCellBorder(components[after(columns, i)], style, 'left')
        if(isTopMost(total, columns, indices, i))
          setCellBorder(components[above(columns, i)], style, 'bottom')
        if(isBottomMost(total, columns, indices, i))
          setCellBorder(components[below(columns, i)], style, 'top')
        break;
      case 'in':
        if(!isLeftMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'left')
        }
        if(!isRightMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'right')
        }
        if(!isTopMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'top')
        }
        if(!isBottomMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'bottom')
        }
        break;
      case 'out':
        if(isLeftMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'left')
          setCellBorder(components[before(columns, i)], style, 'right')
        }
        if(isRightMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'right')
          setCellBorder(components[after(columns, i)], style, 'left')
        }
        if(isTopMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'top')
          setCellBorder(components[above(columns, i)], style, 'bottom')
        }
        if(isBottomMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'bottom')
          setCellBorder(components[below(columns, i)], style, 'top')
        }
        break;
      case 'left':
        if(isLeftMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'left')
          setCellBorder(components[before(columns, i)], style, 'right')
        }
        break;
      case 'right':
        if(isRightMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'right')
          setCellBorder(components[after(columns, i)], style, 'left')
        }
        break;
      case 'center':
        if(!isLeftMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'left')
        }
        if(!isRightMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'right')
        }
        break;
      case 'middle':
        if(!isTopMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'top')
        }
        if(!isBottomMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'bottom')
        }
        break;
      case 'top':
        if(isTopMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'top')
          setCellBorder(components[above(columns, i)], style, 'bottom')
        }
        break;
      case 'bottom':
        if(isBottomMost(total, columns, indices, i)) {
          setCellBorder(cell, style, 'bottom')
          setCellBorder(components[below(columns, i)], style, 'top')
        }
        break;
      case 'clear':
        setCellBorder(cell, CLEAR_STYLE, 'all')

        if(isLeftMost(total, columns, indices, i))
          setCellBorder(components[before(columns, i)], CLEAR_STYLE, 'right')
        if(isRightMost(total, columns, indices, i))
          setCellBorder(components[after(columns, i)], CLEAR_STYLE, 'left')
        if(isTopMost(total, columns, indices, i))
          setCellBorder(components[above(columns, i)], CLEAR_STYLE, 'bottom')
        if(isBottomMost(total, columns, indices, i))
          setCellBorder(components[below(columns, i)], CLEAR_STYLE, 'top')
      }
    })
  }

  setCellsData() {
    var data = this.get('data')

    if(!data)
      return

    data = this.toObjectArrayValue(data)

    var cells = this.components;
    var columns = this.get('columns');

    cells.forEach(cell => {
      var dataKey = cell.model.dataKey
      var dataIndex = cell.model.dataIndex
      if(dataKey && dataIndex >= 0) {
        cell.set('text', data[dataIndex][dataKey] || "")
      }
    })
  }

  getRowColumn(cell) {
    var idx = this.components.indexOf(cell)
    var length = this.components.length

    return {
      column: idx % this.columns,
      row: Math.floor(idx / this.columns)
    }
  }

  getCellsByRow(row) {
    return this.components.slice(row * this.columns, (row + 1) * this.columns)
  }

  getCellsByColumn(column) {
    var cells = []
    for(var i = 0;i < this.rows;i++)
      cells.push(this.components[this.columns * i + column])

    return cells
  }

  deleteRows(cells) {
    var removalRows = []

    cells.forEach((cell) => {
      let row = this.getRowColumn(cell).row
      if(-1 == removalRows.indexOf(row))
        removalRows.push(row)
    })

    var heights = this.heights.slice()
    removalRows.reverse().forEach((row) => {
      this.remove(this.getCellsByRow(row))
      heights.splice(row, 1)
    })

    this.model.rows -= removalRows.length // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.
    this.set('heights', heights)
  }

  deleteColumns(cells) {
    var removalColumns = []

    cells.forEach((cell) => {
      let column = this.getRowColumn(cell).column
      if(-1 == removalColumns.indexOf(column))
        removalColumns.push(column)
    })

    var widths = this.widths.slice()
    removalColumns.reverse().forEach((column) => {
      this.remove(this.getCellsByColumn(column))
      widths.splice(column, 1)
    })

    this.model.columns -= removalColumns.length // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.
    this.set('widths', widths)
  }

  insertCellsAbove(cells) {
    var rows = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == rows.indexOf(rowcolumn.row))
        rows.push(rowcolumn.row)
    })

    rows.sort()
    var insertionRowPosition = rows[0]

    var newbieRowHeights = []
    var newbieCells = []

    rows.forEach((row) => {
      for(let i = 0;i < this.columns;i++)
        newbieCells.push(buildCopiedCell(this.components[row * this.columns + i].model, this.app))
      newbieRowHeights.push(this.heights[row])
    })

    newbieCells.reverse().forEach((cell) => {
      this.insertComponentAt(cell, insertionRowPosition * this.columns);
    })

    var heights = this.heights.slice()
    heights.splice(insertionRowPosition, 0, ...newbieRowHeights)
    this.set('heights', heights)

    this.model.rows += rows.length

    this.clearCache()
  }

  insertCellsBelow(cells) {
    var rows = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == rows.indexOf(rowcolumn.row))
        rows.push(rowcolumn.row)
    })

    rows.sort()
    // Insert Above와 이 부분만 다르다.
    var insertionRowPosition = rows[rows.length - 1] + 1

    var newbieRowHeights = []
    var newbieCells = []

    rows.forEach((row) => {
      for(let i = 0;i < this.columns;i++)
        newbieCells.push(buildCopiedCell(this.components[row * this.columns + i].model, this.app))
      newbieRowHeights.push(this.heights[row])
    })

    newbieCells.reverse().forEach((cell) => {
      this.insertComponentAt(cell, insertionRowPosition * this.columns);
    })

    var heights = this.heights.slice()
    heights.splice(insertionRowPosition, 0, ...newbieRowHeights)
    this.set('heights', heights)

    this.model.rows += rows.length

    this.clearCache()
  }

  insertCellsLeft(cells) {
    var columns = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == columns.indexOf(rowcolumn.column))
        columns.push(rowcolumn.column)
    })

    columns.sort()
    var insertionColumnPosition = columns[0]

    var newbieColumnWidths = []
    var newbieCells = []

    columns.forEach((column) => {
      for(let i = 0;i < this.rows;i++)
        newbieCells.push(buildCopiedCell(this.components[column * this.rows + i].model, this.app))
      newbieColumnWidths.push(this.widths[column])
    })

    var increasedColumns = this.columns
    var index = this.rows
    newbieCells.reverse().forEach((cell) => {
      if(index == 0) {
        index = this.rows
        increasedColumns++
      }

      index--
      this.insertComponentAt(cell, insertionColumnPosition + (index * increasedColumns));
    })

    var widths = this.widths.slice()
    this.model.columns += columns.length // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

    widths.splice(insertionColumnPosition, 0, ...newbieColumnWidths)

    this.set('widths', widths)
  }

  insertCellsRight(cells) {
    var columns = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == columns.indexOf(rowcolumn.column))
        columns.push(rowcolumn.column)
    })

    columns.sort()
    // Insert Left와 이 부분만 다르다.
    var insertionColumnPosition = columns[columns.length - 1] + 1

    var newbieColumnWidths = []
    var newbieCells = []

    columns.forEach((column) => {
      for(let i = 0;i < this.rows;i++)
        newbieCells.push(buildCopiedCell(this.components[column * this.rows + i].model, this.app))
      newbieColumnWidths.push(this.widths[column])
    })

    var increasedColumns = this.columns
    var index = this.rows
    newbieCells.reverse().forEach((cell) => {
      if(index == 0) {
        index = this.rows
        increasedColumns++
      }

      index--
      this.insertComponentAt(cell, insertionColumnPosition + (index * increasedColumns));
    })

    var widths = this.widths.slice()
    this.model.columns += columns.length // 고의적으로, change 이벤트가 발생하지 않도록 set(..)을 사용하지 않음.

    widths.splice(insertionColumnPosition, 0, ...newbieColumnWidths)
    this.set('widths', widths)
  }

  distributeHorizontal(cells) {
    var columns = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == columns.indexOf(rowcolumn.column))
        columns.push(rowcolumn.column)
    })

    var sum = columns.reduce((sum, column) => {
      return sum + this.widths[column]
    }, 0)

    var newval = Math.round((sum / columns.length) * 100) / 100
    var widths = this.widths.slice()
    columns.forEach((column) => {
      widths[column] = newval
    })

    this.set('widths', widths)
  }

  distributeVertical(cells) {
    var rows = []

    cells.forEach((cell) => {
      let rowcolumn = this.getRowColumn(cell)

      if(-1 == rows.indexOf(rowcolumn.row))
        rows.push(rowcolumn.row)
    })

    var sum = rows.reduce((sum, row) => {
      return sum + this.heights[row]
    }, 0)

    var newval = Math.round((sum / rows.length) * 100) / 100
    var heights = this.heights.slice()
    rows.forEach((row) => {
      heights[row] = newval
    })

    this.set('heights', heights)
  }

  toObjectArrayValue(array) {
    if(!array || array.length === 0)
      return null

    if(!array[0].hasOwnProperty('__field1')) {
      return array
    }

    let indexKeyMap = {}
    let value = []

    for(let key in array[0]) {
      indexKeyMap[key] = array[0][key]
    }

    for(var i = 1; i < array.length; i++) {
      let object = {}
      let thisObject = array[i]
      for(let key in indexKeyMap) {
        let k = indexKeyMap[key];
        let v = thisObject[key];
        object[k] = v
      }

      value.push(object)
    }

    return value
  }

  get columns() {
    return this.get('columns')
  }

  get lefts() {
    return this.components.filter((c, i) => {
      return !(i % this.columns)
    });
  }

  get centers() {
    return this.components.filter((c, i) => {
      return (i % this.columns) && ((i + 1) % this.columns)
    });
  }

  get rights() {
    return this.components.filter((c, i) => {
      return !((i + 1) % this.columns)
    });
  }

  get tops() {
    return this.components.slice(0, this.columns)
  }

  get middles() {
    return this.components.slice(this.columns, this.columns * (this.rows - 1))
  }

  get bottoms() {
    return this.components.slice(this.columns * (this.rows - 1))
  }

  get all() {
    return this.components
  }

  get widths_sum() {
    var widths = this.widths;
    return widths ? widths.filter((width, i) => i < this.columns).reduce((sum, width) => sum + width, 0) : this.columns
  }

  get heights_sum() {
    var heights = this.heights;
    return heights ? heights.filter((height, i) => i < this.rows).reduce((sum, height) => sum + height, 0) : this.rows
  }

  get nature() {
    return NATURE
  }

  get controls() {
    var widths = this.widths;
    var heights = this.heights;
    var inside = this.textBounds;

    var width_unit = inside.width / this.widths_sum;
    var height_unit = inside.height / this.heights_sum;

    var x = inside.left;
    var y = inside.top;

    var controls = [];

    widths.slice(0, this.columns - 1).forEach(width => {
      x += width * width_unit
      controls.push({
        x: x,
        y: inside.top,
        handler: columnControlHandler
      })
    })

    heights.slice(0, this.rows - 1).forEach(height => {
      y += height * height_unit
      controls.push({
        x: inside.left,
        y: y,
        handler: rowControlHandler
      })
    })

    return controls
  }

  onchange(after, before) {
    if(hasAnyProperty(after, "rows", "columns")) {
      this.buildCells(
        this.get('rows'),
        this.get('columns'),
        before.rows === undefined ? this.get('rows') : before.rows,
        before.columns === undefined ? this.get('columns') : before.columns
      )
    }

    if(before.data || after.data) {
      this.setCellsData()
    }
  }

  get eventMap() {
    return {
      '(self)': {
        '(descendant)': {
          change: this.oncellchanged
        }
      }
    }
  }

  oncellchanged(after, before) {
    if(hasAnyProperty(after, "dataKey", "dataIndex")) {
      this.setCellsData()
    }
  }
}

["rows", "columns", "widths", "heights", "widths_sum", "heights_sum", "controls"].forEach(getter => Component.memoize(Table.prototype, getter, false));

Component.register('table', Table);

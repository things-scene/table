(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _table=require("./table");Object.defineProperty(exports,"Table",{enumerable:true,get:function get(){return _interopRequireDefault(_table).default}});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}},{"./table":4}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var _scene=scene;var Component=_scene.Component;var Container=_scene.Container;var RectPath=_scene.RectPath;var Layout=_scene.Layout;var NATURE={mutable:false,resizable:true,rotatable:true,properties:[{type:"editor-border",label:"",name:"",property:{}}]};var EMPTY_BORDER={};var TableCell=function(_RectPath){_inherits(TableCell,_RectPath);function TableCell(){_classCallCheck(this,TableCell);return _possibleConstructorReturn(this,(TableCell.__proto__||Object.getPrototypeOf(TableCell)).apply(this,arguments))}_createClass(TableCell,[{key:"_drawBorder",value:function _drawBorder(context,x,y,to_x,to_y,style){if(style&&style.strokeStyle&&style.lineWidth&&style.lineDash){context.beginPath();context.moveTo(x,y);context.lineTo(to_x,to_y);Component.drawStroke(context,style)}}},{key:"_draw",value:function _draw(context){var _model=this.model;var left=_model.left;var top=_model.top;var width=_model.width;var height=_model.height;var border=this.model.border||{};context.beginPath();context.lineWidth=0;context.rect(left,top,width,height);this.drawFill(context);this._drawBorder(context,left,top,left+width,top,border.top);this._drawBorder(context,left+width,top,left+width,top+height,border.right);this._drawBorder(context,left+width,top+height,left,top+height,border.bottom);this._drawBorder(context,left,top+height,left,top,border.left)}},{key:"nature",get:function get(){return NATURE}},{key:"rowspan",get:function get(){return this.get("rowspan")}},{key:"colspan",get:function get(){return this.get("colspan")}},{key:"border",get:function get(){var border=this.model.border||EMPTY_BORDER}}]);return TableCell}(RectPath(Component));exports.default=TableCell;["border"].forEach(function(getter){return Component.memoize(TableCell.prototype,getter,false)});Component.register("table-cell",TableCell)},{}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _scene=scene;var Layout=_scene.Layout;var TableLayout={reflow:function reflow(container){var layoutConfig=container.get("layoutConfig");var columns=layoutConfig&&layoutConfig.columns||container.get("columns");var rows=layoutConfig&&layoutConfig.rows||container.get("rows");var widths=layoutConfig&&layoutConfig.widths||container.get("widths");var heights=layoutConfig&&layoutConfig.heights||container.get("heights");var widths_sum=widths?widths.filter(function(width,i){return i<columns}).reduce(function(sum,width){return sum+width},0):columns;var heights_sum=heights?heights.filter(function(height,i){return i<rows}).reduce(function(sum,height){return sum+height},0):rows;var inside=container.textBounds;var paddingLeft=container.get("paddingLeft")||0;var paddingTop=container.get("paddingTop")||0;var width_unit=inside.width/widths_sum;var height_unit=inside.height/heights_sum;var x=0;var y=0;container.components.forEach(function(component,idx){var w=widths?widths[idx%columns]:1;var h=heights?heights[Math.floor(idx/columns)]:1;component.bounds={left:paddingLeft+x,top:paddingTop+y,width:width_unit*w,height:height_unit*h};component.set("rotation",0);if(idx%columns==columns-1){x=0;y+=h*height_unit}else{x+=w*width_unit}})},capturables:function capturables(container){return container.components},drawables:function drawables(container){return container.components},isStuck:function isStuck(component){return true},joinType:true};Layout.register("table",TableLayout);exports.default=TableLayout},{}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _tableCell=require("./table-cell");var _tableCell2=_interopRequireDefault(_tableCell);var _tableLayout=require("./table-layout");var _tableLayout2=_interopRequireDefault(_tableLayout);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var _scene=scene;var Component=_scene.Component;var Container=_scene.Container;var Layout=_scene.Layout;var Model=_scene.Model;var SIDES={all:["top","left","bottom","right"],out:["top","left","bottom","right"],left:["left"],right:["right"],top:["top"],bottom:["bottom"],leftright:["left","right"],topbottom:["top","bottom"]};var CLEAR_STYLE={strokeStyle:"",lineDash:"solid",lineWidth:0};var DEFAULT_STYLE={strokeStyle:"red",lineDash:"solid",lineWidth:1};var TABLE_LAYOUT=Layout.get("table");function hasAnyProperty(o){for(var _len=arguments.length,properties=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){properties[_key-1]=arguments[_key]}for(var p in properties){if(o.hasOwnProperty(properties[p]))return true}}function buildNewCell(app){return Model.compile({type:"table-cell",strokeStyle:"blue",left:0,top:0,width:1,height:1,textWrap:true,border:buildBorderStyle(DEFAULT_STYLE,"all")},app)}function buildBorderStyle(style,where){return(SIDES[where]||[]).reduce(function(border,side){border[side]=style;return border},{})}function setCellBorder(cell,style,where){if(!cell)return;cell.set("border",Object.assign({},cell.get("border")||{},buildBorderStyle(style,where)))}function isLeftMost(total,columns,indices,i){return i==0||!(i%columns)||indices.indexOf(i-1)==-1}function isRightMost(total,columns,indices,i){return i==total-1||i%columns==columns-1||indices.indexOf(i+1)==-1}function isTopMost(total,columns,indices,i){return i<columns||indices.indexOf(i-columns)==-1}function isBottomMost(total,columns,indices,i){return i>total-columns-1||indices.indexOf(i+columns)==-1}function above(columns,i){return i-columns}function below(columns,i){return i+columns}function before(columns,i){return!(i%columns)?-1:i-1}function after(columns,i){return!((i+1)%columns)?-1:i+1}function array(value,size){var arr=[];for(var i=0;i<size;i++){arr.push(1)}return arr}var columnControlHandler={ondragmove:function ondragmove(point,index,component){var _component$textBounds=component.textBounds;var left=_component$textBounds.left;var top=_component$textBounds.top;var width=_component$textBounds.width;var height=_component$textBounds.height;var widths_sum=component.widths_sum;var widths=component.widths.slice();var origin_pos_unit=widths.slice(0,index+1).reduce(function(sum,width){return sum+width},0);var origin_offset=left+origin_pos_unit/widths_sum*width;var transcoorded=component.transcoordP2S(point.x,point.y);var diff=transcoorded.x-origin_offset;var diff_unit=diff/width*widths_sum;var min_width_unit=widths_sum/width*10;if(diff_unit<0)diff_unit=-Math.min(widths[index]-min_width_unit,-diff_unit);else diff_unit=Math.min(widths[index+1]-min_width_unit,diff_unit);widths[index]+=diff_unit;widths[index+1]-=diff_unit;component.set("widths",widths)}};var rowControlHandler={ondragmove:function ondragmove(point,index,component){var _component$textBounds2=component.textBounds;var left=_component$textBounds2.left;var top=_component$textBounds2.top;var width=_component$textBounds2.width;var height=_component$textBounds2.height;var heights_sum=component.heights_sum;var heights=component.heights.slice();index-=component.columns-1;var origin_pos_unit=heights.slice(0,index+1).reduce(function(sum,height){return sum+height},0);var origin_offset=top+origin_pos_unit/heights_sum*height;var transcoorded=component.transcoordP2S(point.x,point.y);var diff=transcoorded.y-origin_offset;var diff_unit=diff/height*heights_sum;var min_height_unit=heights_sum/height*10;if(diff_unit<0)diff_unit=-Math.min(heights[index]-min_height_unit,-diff_unit);else diff_unit=Math.min(heights[index+1]-min_height_unit,diff_unit);heights[index]+=diff_unit;heights[index+1]-=diff_unit;component.set("heights",heights)}};var Table=function(_Container){_inherits(Table,_Container);function Table(){_classCallCheck(this,Table);return _possibleConstructorReturn(this,(Table.__proto__||Object.getPrototypeOf(Table)).apply(this,arguments))}_createClass(Table,[{key:"created",value:function created(){var tobeSize=this.rows*this.columns;var gap=this.size()-tobeSize;if(gap==0){return}else if(gap>0){var removals=this._components.slice(gap);this.remove(removals)}else{var newbies=[];for(var i=0;i<-gap;i++){newbies.push(buildNewCell(this.app))}this.add(newbies)}var widths=this.get("widths");var heights=this.get("heights");if(!widths||widths.length<this.columns)this.set("widths",this.widths);if(!heights||heights.length<this.rows)this.set("heights",this.heights)}},{key:"buildCells",value:function buildCells(newrows,newcolumns,oldrows,oldcolumns){if(newrows<oldrows){var removals=this._components.slice(oldcolumns*newrows);this.remove(removals)}var minrows=Math.min(newrows,oldrows);if(newcolumns>oldcolumns){for(var r=0;r<minrows;r++){for(var c=oldcolumns;c<newcolumns;c++){this.insertComponentAt(buildNewCell(this.app),r*newcolumns+c)}}}else if(newcolumns<oldcolumns){var _removals=[];for(var _r=0;_r<minrows;_r++){for(var _c=newcolumns;_c<oldcolumns;_c++){_removals.push(this.components[_r*oldcolumns+_c])}}this.remove(_removals)}if(newrows>oldrows){var newbies=[];for(var _r2=oldrows;_r2<newrows;_r2++){for(var i=0;i<newcolumns;i++){newbies.push(buildNewCell(this.app))}}this.add(newbies)}this.set({widths:this.widths,heights:this.heights})}},{key:"setCellsStyle",value:function setCellsStyle(cells,style,where){var components=this.components;var total=components.length;var columns=this.get("columns");var indices=cells.map(function(cell){return components.indexOf(cell)});indices.forEach(function(i){var cell=components[i];switch(where){case"all":setCellBorder(cell,style,where);if(isLeftMost(total,columns,indices,i))setCellBorder(components[before(columns,i)],style,"right");if(isRightMost(total,columns,indices,i))setCellBorder(components[after(columns,i)],style,"left");if(isTopMost(total,columns,indices,i))setCellBorder(components[above(columns,i)],style,"bottom");if(isBottomMost(total,columns,indices,i))setCellBorder(components[below(columns,i)],style,"top");break;case"in":if(!isLeftMost(total,columns,indices,i)){setCellBorder(cell,style,"left")}if(!isRightMost(total,columns,indices,i)){setCellBorder(cell,style,"right")}if(!isTopMost(total,columns,indices,i)){setCellBorder(cell,style,"top")}if(!isBottomMost(total,columns,indices,i)){setCellBorder(cell,style,"bottom")}break;case"out":if(isLeftMost(total,columns,indices,i)){setCellBorder(cell,style,"left");setCellBorder(components[before(columns,i)],style,"right")}if(isRightMost(total,columns,indices,i)){setCellBorder(cell,style,"right");setCellBorder(components[after(columns,i)],style,"left")}if(isTopMost(total,columns,indices,i)){setCellBorder(cell,style,"top");setCellBorder(components[above(columns,i)],style,"bottom")}if(isBottomMost(total,columns,indices,i)){setCellBorder(cell,style,"bottom");setCellBorder(components[below(columns,i)],style,"top")}break;case"left":if(isLeftMost(total,columns,indices,i)){setCellBorder(cell,style,"left");setCellBorder(components[before(columns,i)],style,"right")}break;case"right":if(isRightMost(total,columns,indices,i)){setCellBorder(cell,style,"right");setCellBorder(components[after(columns,i)],style,"left")}break;case"center":if(!isLeftMost(total,columns,indices,i)){setCellBorder(cell,style,"left")}if(!isRightMost(total,columns,indices,i)){setCellBorder(cell,style,"right")}break;case"middle":if(!isTopMost(total,columns,indices,i)){setCellBorder(cell,style,"top")}if(!isBottomMost(total,columns,indices,i)){setCellBorder(cell,style,"bottom")}break;case"top":if(isTopMost(total,columns,indices,i)){setCellBorder(cell,style,"top");setCellBorder(components[above(columns,i)],style,"bottom")}break;case"bottom":if(isBottomMost(total,columns,indices,i)){setCellBorder(cell,style,"bottom");setCellBorder(components[below(columns,i)],style,"top")}break;case"clear":setCellBorder(cell,CLEAR_STYLE,"all");if(isLeftMost(total,columns,indices,i))setCellBorder(components[before(columns,i)],CLEAR_STYLE,"right");if(isRightMost(total,columns,indices,i))setCellBorder(components[after(columns,i)],CLEAR_STYLE,"left");if(isTopMost(total,columns,indices,i))setCellBorder(components[above(columns,i)],CLEAR_STYLE,"bottom");if(isBottomMost(total,columns,indices,i))setCellBorder(components[below(columns,i)],CLEAR_STYLE,"top")}})}},{key:"onchange",value:function onchange(after,before){if(hasAnyProperty(after,"rows","columns")){this.buildCells(this.get("rows"),this.get("columns"),before.rows===undefined?this.get("rows"):before.rows,before.columns===undefined?this.get("columns"):before.columns)}}},{key:"widths",get:function get(){var widths=this.get("widths");if(!widths)return array(1,this.columns);if(widths.length<this.columns)return widths.concat(array(1,this.columns-widths.length));else if(widths.length>this.columns)return widths.slice(0,this.columns);return widths}},{key:"heights",get:function get(){var heights=this.get("heights");if(!heights)return array(1,this.rows);if(heights.length<this.rows)return heights.concat(array(1,this.rows-heights.length));else if(heights.length>this.rows)return heights.slice(0,this.rows);return heights}},{key:"layout",get:function get(){return TABLE_LAYOUT}},{key:"rows",get:function get(){return this.get("rows")}},{key:"columns",get:function get(){return this.get("columns")}},{key:"lefts",get:function get(){var _this2=this;return this.components.filter(function(c,i){return!(i%_this2.columns)})}},{key:"centers",get:function get(){var _this3=this;return this.components.filter(function(c,i){return i%_this3.columns&&(i+1)%_this3.columns})}},{key:"rights",get:function get(){var _this4=this;return this.components.filter(function(c,i){return!((i+1)%_this4.columns)})}},{key:"tops",get:function get(){return this.components.slice(0,this.columns)}},{key:"middles",get:function get(){return this.components.slice(this.columns,this.columns*(this.rows-1))}},{key:"bottoms",get:function get(){return this.components.slice(this.columns*(this.rows-1))}},{key:"all",get:function get(){return this.components}},{key:"widths_sum",get:function get(){var _this5=this;var widths=this.widths;return widths?widths.filter(function(width,i){return i<_this5.columns}).reduce(function(sum,width){return sum+width},0):this.columns}},{key:"heights_sum",get:function get(){var _this6=this;var heights=this.heights;return heights?heights.filter(function(height,i){return i<_this6.rows}).reduce(function(sum,height){return sum+height},0):this.rows}},{key:"controls",get:function get(){var widths=this.widths;var heights=this.heights;var inside=this.textBounds;var width_unit=inside.width/this.widths_sum;var height_unit=inside.height/this.heights_sum;var x=inside.left;var y=inside.top;var controls=[];widths.slice(0,this.columns-1).forEach(function(width){x+=width*width_unit;controls.push({x:x,y:inside.top,handler:columnControlHandler})});heights.slice(0,this.rows-1).forEach(function(height){y+=height*height_unit;controls.push({x:inside.left,y:y,handler:rowControlHandler})});return controls}}]);return Table}(Container);exports.default=Table;["rows","columns","widths","heights","widths_sum","heights_sum","controls"].forEach(function(getter){return Component.memoize(Table.prototype,getter,false)});Component.register("table",Table)},{"./table-cell":2,"./table-layout":3}]},{},[1]);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;
exports.keysBetween = keysBetween;

var _promise = require('./promise');

var _backbonePouch = require('backbone-pouch');

var _lodash = require('lodash');

// # keysBetween
// A common CouchDB pattern is querying documents by keys in a range.
// Use within a pouch config object like: `...keysBetween( 'points/' )`
function keysBetween(base) {
  return {
    startkey: base,
    endkey: base + '￿'
  };
}

// # CouchModel
// This is a base class for backbone models that use backbone pouch. CouchDB
// documents contain keys that you need to work with the database, but are
// irrelevant to the domain purpose of the model.
//
// It stores an array of these document keys in `this.safeguard`. By default,
// the array includes `_id` and `_rev`. However, subclasses of CouchModel
// may specify more.
//
// Other functions may use `this.safeguard` in their logic. For instance,
// the validation mixin does not consider safeguarded keys in model validation.
// (otherwise you would have to include _id and _rev in the schema for all
// models)
/* btc-app-server -- Server for the Bicycle Touring Companion
 * Copyright © 2016 Adventure Cycling Association
 *
 * This file is part of btc-app-server.
 *
 * btc-app-server is free software: you can redistribute it and/or modify
 * it under the terms of the Affero GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * btc-app-server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero GNU General Public License for more details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

var safeguard = ['_id', '_rev'];

var CouchModel = exports.CouchModel = _promise.PromiseModel.extend({
  initialize: function initialize(attributes, options) {
    _promise.PromiseModel.prototype.initialize.apply(this, arguments);
    this.safeguard = (0, _lodash.union)(safeguard, this.safeguard);
  }
});

var _attachments = (0, _backbonePouch.attachments)();
var _attach = _attachments.attach;
_attachments.attach = function (blob, name, type, done) {
  var _this = this;

  var args = [blob];
  if (!(0, _lodash.isFunction)(name)) {
    args.push(name);
    if (!(0, _lodash.isFunction)(type)) {
      args.push(type);
    }
  }
  return new Promise(function (resolve, reject) {
    args.push(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
    _attach.apply(_this, args);
  });
};
var _attachment = _attachments.attachment;
_attachments.attachment = function (name) {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var callback = function callback(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
    _attachment.call(_this2, name, callback);
  });
};
(0, _lodash.assign)(CouchModel.prototype, _attachments);

// ## Couch Collection
// By default, btc-models use the allDocs method with include_docs = true.
// Therefore, we need to pick the document objects in the response array.
var CouchCollection = exports.CouchCollection = _promise.PromiseCollection.extend({
  parse: function parse(response, options) {
    return (0, _lodash.map)(response.rows, 'doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQTJCZ0I7O0FBUmhCOztBQUVBOztBQUNBOzs7OztBQUtPLFNBQVMsV0FBVCxDQUFzQixJQUF0QixFQUE2QjtBQUNsQyxTQUFPO0FBQ0wsY0FBVSxJQUFWO0FBQ0EsWUFBUSxPQUFPLEdBQVA7R0FGVixDQURrQztDQUE3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CUCxJQUFNLFlBQVksQ0FBRSxLQUFGLEVBQVMsTUFBVCxDQUFaOztBQUVDLElBQU0sa0NBQWEsc0JBQWEsTUFBYixDQUFxQjtBQUM3QyxjQUFZLG9CQUFVLFVBQVYsRUFBc0IsT0FBdEIsRUFBZ0M7QUFDMUMsMEJBQWEsU0FBYixDQUF1QixVQUF2QixDQUFrQyxLQUFsQyxDQUF5QyxJQUF6QyxFQUErQyxTQUEvQyxFQUQwQztBQUUxQyxTQUFLLFNBQUwsR0FBaUIsbUJBQU8sU0FBUCxFQUFrQixLQUFLLFNBQUwsQ0FBbkMsQ0FGMEM7R0FBaEM7Q0FEWSxDQUFiOztBQU9iLElBQU0sZUFBZSxpQ0FBZjtBQUNOLElBQU0sVUFBVSxhQUFhLE1BQWI7QUFDaEIsYUFBYSxNQUFiLEdBQXNCLFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFtQzs7O0FBQ3ZELE1BQUksT0FBTyxDQUFFLElBQUYsQ0FBUCxDQURtRDtBQUV2RCxNQUFLLENBQUMsd0JBQVksSUFBWixDQUFELEVBQXNCO0FBQ3pCLFNBQUssSUFBTCxDQUFXLElBQVgsRUFEeUI7QUFFekIsUUFBSyxDQUFDLHdCQUFZLElBQVosQ0FBRCxFQUFzQjtBQUN6QixXQUFLLElBQUwsQ0FBVyxJQUFYLEVBRHlCO0tBQTNCO0dBRkY7QUFNQSxTQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDekMsU0FBSyxJQUFMLENBQVcsVUFBRSxHQUFGLEVBQU8sTUFBUCxFQUFtQjtBQUM1QixVQUFLLEdBQUwsRUFBVztBQUNULGVBQVEsR0FBUixFQURTO09BQVgsTUFFTztBQUNMLGdCQUFTLE1BQVQsRUFESztPQUZQO0tBRFMsQ0FBWCxDQUR5QztBQVF6QyxZQUFRLEtBQVIsUUFBcUIsSUFBckIsRUFSeUM7R0FBdkIsQ0FBcEIsQ0FSdUQ7Q0FBbkM7QUFtQnRCLElBQU0sY0FBYyxhQUFhLFVBQWI7QUFDcEIsYUFBYSxVQUFiLEdBQTBCLFVBQVUsSUFBVixFQUFpQjs7O0FBQ3pDLFNBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN6QyxRQUFNLFdBQVcsU0FBWCxRQUFXLENBQUUsR0FBRixFQUFPLE1BQVAsRUFBbUI7QUFDbEMsVUFBSyxHQUFMLEVBQVc7QUFDVCxlQUFRLEdBQVIsRUFEUztPQUFYLE1BRU87QUFDTCxnQkFBUyxNQUFULEVBREs7T0FGUDtLQURlLENBRHdCO0FBUXpDLGdCQUFZLElBQVosU0FBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFSeUM7R0FBdkIsQ0FBcEIsQ0FEeUM7Q0FBakI7QUFZMUIsb0JBQVEsV0FBVyxTQUFYLEVBQXNCLFlBQTlCOzs7OztBQUtPLElBQU0sNENBQWtCLDJCQUFrQixNQUFsQixDQUEwQjtBQUN2RCxTQUFPLGVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE4QjtBQUNuQyxXQUFPLGlCQUFLLFNBQVMsSUFBVCxFQUFlLEtBQXBCLENBQVAsQ0FEbUM7R0FBOUI7Q0FEc0IsQ0FBbEIiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgUHJvbWlzZU1vZGVsLCBQcm9taXNlQ29sbGVjdGlvbiB9IGZyb20gJy4vcHJvbWlzZSc7XG5cbmltcG9ydCB7IGF0dGFjaG1lbnRzIH0gZnJvbSAnYmFja2JvbmUtcG91Y2gnO1xuaW1wb3J0IHsgYXNzaWduLCB1bmlvbiwgbWFwLCBpc0Z1bmN0aW9uIH0gZnJvbSAnbG9kYXNoJztcblxuLy8gIyBrZXlzQmV0d2VlblxuLy8gQSBjb21tb24gQ291Y2hEQiBwYXR0ZXJuIGlzIHF1ZXJ5aW5nIGRvY3VtZW50cyBieSBrZXlzIGluIGEgcmFuZ2UuXG4vLyBVc2Ugd2l0aGluIGEgcG91Y2ggY29uZmlnIG9iamVjdCBsaWtlOiBgLi4ua2V5c0JldHdlZW4oICdwb2ludHMvJyApYFxuZXhwb3J0IGZ1bmN0aW9uIGtleXNCZXR3ZWVuKCBiYXNlICkge1xuICByZXR1cm4ge1xuICAgIHN0YXJ0a2V5OiBiYXNlLFxuICAgIGVuZGtleTogYmFzZSArICdcXHVmZmZmJ1xuICB9O1xufVxuXG4vLyAjIENvdWNoTW9kZWxcbi8vIFRoaXMgaXMgYSBiYXNlIGNsYXNzIGZvciBiYWNrYm9uZSBtb2RlbHMgdGhhdCB1c2UgYmFja2JvbmUgcG91Y2guIENvdWNoREJcbi8vIGRvY3VtZW50cyBjb250YWluIGtleXMgdGhhdCB5b3UgbmVlZCB0byB3b3JrIHdpdGggdGhlIGRhdGFiYXNlLCBidXQgYXJlXG4vLyBpcnJlbGV2YW50IHRvIHRoZSBkb21haW4gcHVycG9zZSBvZiB0aGUgbW9kZWwuXG4vL1xuLy8gSXQgc3RvcmVzIGFuIGFycmF5IG9mIHRoZXNlIGRvY3VtZW50IGtleXMgaW4gYHRoaXMuc2FmZWd1YXJkYC4gQnkgZGVmYXVsdCxcbi8vIHRoZSBhcnJheSBpbmNsdWRlcyBgX2lkYCBhbmQgYF9yZXZgLiBIb3dldmVyLCBzdWJjbGFzc2VzIG9mIENvdWNoTW9kZWxcbi8vIG1heSBzcGVjaWZ5IG1vcmUuXG4vL1xuLy8gT3RoZXIgZnVuY3Rpb25zIG1heSB1c2UgYHRoaXMuc2FmZWd1YXJkYCBpbiB0aGVpciBsb2dpYy4gRm9yIGluc3RhbmNlLFxuLy8gdGhlIHZhbGlkYXRpb24gbWl4aW4gZG9lcyBub3QgY29uc2lkZXIgc2FmZWd1YXJkZWQga2V5cyBpbiBtb2RlbCB2YWxpZGF0aW9uLlxuLy8gKG90aGVyd2lzZSB5b3Ugd291bGQgaGF2ZSB0byBpbmNsdWRlIF9pZCBhbmQgX3JldiBpbiB0aGUgc2NoZW1hIGZvciBhbGxcbi8vIG1vZGVscylcbmNvbnN0IHNhZmVndWFyZCA9IFsgJ19pZCcsICdfcmV2JyBdO1xuXG5leHBvcnQgY29uc3QgQ291Y2hNb2RlbCA9IFByb21pc2VNb2RlbC5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgUHJvbWlzZU1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB0aGlzLnNhZmVndWFyZCA9IHVuaW9uKCBzYWZlZ3VhcmQsIHRoaXMuc2FmZWd1YXJkICk7XG4gIH1cbn0gKTtcblxuY29uc3QgX2F0dGFjaG1lbnRzID0gYXR0YWNobWVudHMoKTtcbmNvbnN0IF9hdHRhY2ggPSBfYXR0YWNobWVudHMuYXR0YWNoO1xuX2F0dGFjaG1lbnRzLmF0dGFjaCA9IGZ1bmN0aW9uKCBibG9iLCBuYW1lLCB0eXBlLCBkb25lICkge1xuICBsZXQgYXJncyA9IFsgYmxvYiBdO1xuICBpZiAoICFpc0Z1bmN0aW9uKCBuYW1lICkgKSB7XG4gICAgYXJncy5wdXNoKCBuYW1lICk7XG4gICAgaWYgKCAhaXNGdW5jdGlvbiggdHlwZSApICkge1xuICAgICAgYXJncy5wdXNoKCB0eXBlICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgYXJncy5wdXNoKCAoIGVyciwgcmVzdWx0ICkgPT4ge1xuICAgICAgaWYgKCBlcnIgKSB7XG4gICAgICAgIHJlamVjdCggZXJyICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCByZXN1bHQgKTtcbiAgICAgIH1cbiAgICB9ICk7XG4gICAgX2F0dGFjaC5hcHBseSggdGhpcywgYXJncyApO1xuICB9ICk7XG59O1xuY29uc3QgX2F0dGFjaG1lbnQgPSBfYXR0YWNobWVudHMuYXR0YWNobWVudDtcbl9hdHRhY2htZW50cy5hdHRhY2htZW50ID0gZnVuY3Rpb24oIG5hbWUgKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoIGVyciwgcmVzdWx0ICkgPT4ge1xuICAgICAgaWYgKCBlcnIgKSB7XG4gICAgICAgIHJlamVjdCggZXJyICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCByZXN1bHQgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9hdHRhY2htZW50LmNhbGwoIHRoaXMsIG5hbWUsIGNhbGxiYWNrICk7XG4gIH0gKTtcbn07XG5hc3NpZ24oIENvdWNoTW9kZWwucHJvdG90eXBlLCBfYXR0YWNobWVudHMgKTtcblxuLy8gIyMgQ291Y2ggQ29sbGVjdGlvblxuLy8gQnkgZGVmYXVsdCwgYnRjLW1vZGVscyB1c2UgdGhlIGFsbERvY3MgbWV0aG9kIHdpdGggaW5jbHVkZV9kb2NzID0gdHJ1ZS5cbi8vIFRoZXJlZm9yZSwgd2UgbmVlZCB0byBwaWNrIHRoZSBkb2N1bWVudCBvYmplY3RzIGluIHRoZSByZXNwb25zZSBhcnJheS5cbmV4cG9ydCBjb25zdCBDb3VjaENvbGxlY3Rpb24gPSBQcm9taXNlQ29sbGVjdGlvbi5leHRlbmQoIHtcbiAgcGFyc2U6IGZ1bmN0aW9uKCByZXNwb25zZSwgb3B0aW9ucyApIHtcbiAgICByZXR1cm4gbWFwKCByZXNwb25zZS5yb3dzLCAnZG9jJyApO1xuICB9XG59ICk7XG4iXX0=
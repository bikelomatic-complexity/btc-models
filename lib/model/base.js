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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQTJCZ0I7O0FBUmhCOztBQUVBOztBQUNBOzs7OztBQUtPLFNBQVMsV0FBVCxDQUFzQixJQUF0QixFQUE2QjtBQUNsQyxTQUFPO0FBQ0wsY0FBVSxJQUFWO0FBQ0EsWUFBUSxPQUFPLEdBQVA7R0FGVixDQURrQztDQUE3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CUCxJQUFNLFlBQVksQ0FBRSxLQUFGLEVBQVMsTUFBVCxDQUFaOztBQUVDLElBQU0sa0NBQWEsc0JBQWEsTUFBYixDQUFxQjtBQUM3QyxjQUFZLG9CQUFVLFVBQVYsRUFBc0IsT0FBdEIsRUFBZ0M7QUFDMUMsMEJBQWEsU0FBYixDQUF1QixVQUF2QixDQUFrQyxLQUFsQyxDQUF5QyxJQUF6QyxFQUErQyxTQUEvQyxFQUQwQztBQUUxQyxTQUFLLFNBQUwsR0FBaUIsbUJBQU8sU0FBUCxFQUFrQixLQUFLLFNBQUwsQ0FBbkMsQ0FGMEM7R0FBaEM7Q0FEWSxDQUFiOztBQU9iLElBQU0sZUFBZSxpQ0FBZjtBQUNOLElBQU0sVUFBVSxhQUFhLE1BQWI7QUFDaEIsYUFBYSxNQUFiLEdBQXNCLFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFtQzs7O0FBQ3ZELE1BQUksT0FBTyxDQUFFLElBQUYsQ0FBUCxDQURtRDtBQUV2RCxNQUFLLENBQUMsd0JBQVksSUFBWixDQUFELEVBQXNCO0FBQ3pCLFNBQUssSUFBTCxDQUFXLElBQVgsRUFEeUI7QUFFekIsUUFBSyxDQUFDLHdCQUFZLElBQVosQ0FBRCxFQUFzQjtBQUN6QixXQUFLLElBQUwsQ0FBVyxJQUFYLEVBRHlCO0tBQTNCO0dBRkY7QUFNQSxTQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDekMsU0FBSyxJQUFMLENBQVcsVUFBRSxHQUFGLEVBQU8sTUFBUCxFQUFtQjtBQUM1QixVQUFLLEdBQUwsRUFBVztBQUNULGVBQVEsR0FBUixFQURTO09BQVgsTUFFTztBQUNMLGdCQUFTLE1BQVQsRUFESztPQUZQO0tBRFMsQ0FBWCxDQUR5QztBQVF6QyxZQUFRLEtBQVIsUUFBcUIsSUFBckIsRUFSeUM7R0FBdkIsQ0FBcEIsQ0FSdUQ7Q0FBbkM7QUFtQnRCLElBQU0sY0FBYyxhQUFhLFVBQWI7QUFDcEIsYUFBYSxVQUFiLEdBQTBCLFVBQVUsSUFBVixFQUFpQjs7O0FBQ3pDLFNBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN6QyxRQUFNLFdBQVcsU0FBWCxRQUFXLENBQUUsR0FBRixFQUFPLE1BQVAsRUFBbUI7QUFDbEMsVUFBSyxHQUFMLEVBQVc7QUFDVCxlQUFRLEdBQVIsRUFEUztPQUFYLE1BRU87QUFDTCxnQkFBUyxNQUFULEVBREs7T0FGUDtLQURlLENBRHdCO0FBUXpDLGdCQUFZLElBQVosU0FBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFSeUM7R0FBdkIsQ0FBcEIsQ0FEeUM7Q0FBakI7QUFZMUIsb0JBQVEsV0FBVyxTQUFYLEVBQXNCLFlBQTlCOzs7OztBQUtPLElBQU0sNENBQWtCLDJCQUFrQixNQUFsQixDQUEwQjtBQUN2RCxTQUFPLGVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE4QjtBQUNuQyxXQUFPLGlCQUFLLFNBQVMsSUFBVCxFQUFlLEtBQXBCLENBQVAsQ0FEbUM7R0FBOUI7Q0FEc0IsQ0FBbEIiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cclxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cclxuICpcclxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XHJcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXHJcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcbiAqXHJcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxyXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cclxuICovXHJcblxyXG5pbXBvcnQgeyBQcm9taXNlTW9kZWwsIFByb21pc2VDb2xsZWN0aW9uIH0gZnJvbSAnLi9wcm9taXNlJztcclxuXHJcbmltcG9ydCB7IGF0dGFjaG1lbnRzIH0gZnJvbSAnYmFja2JvbmUtcG91Y2gnO1xyXG5pbXBvcnQgeyBhc3NpZ24sIHVuaW9uLCBtYXAsIGlzRnVuY3Rpb24gfSBmcm9tICdsb2Rhc2gnO1xyXG5cclxuLy8gIyBrZXlzQmV0d2VlblxyXG4vLyBBIGNvbW1vbiBDb3VjaERCIHBhdHRlcm4gaXMgcXVlcnlpbmcgZG9jdW1lbnRzIGJ5IGtleXMgaW4gYSByYW5nZS5cclxuLy8gVXNlIHdpdGhpbiBhIHBvdWNoIGNvbmZpZyBvYmplY3QgbGlrZTogYC4uLmtleXNCZXR3ZWVuKCAncG9pbnRzLycgKWBcclxuZXhwb3J0IGZ1bmN0aW9uIGtleXNCZXR3ZWVuKCBiYXNlICkge1xyXG4gIHJldHVybiB7XHJcbiAgICBzdGFydGtleTogYmFzZSxcclxuICAgIGVuZGtleTogYmFzZSArICdcXHVmZmZmJ1xyXG4gIH07XHJcbn1cclxuXHJcbi8vICMgQ291Y2hNb2RlbFxyXG4vLyBUaGlzIGlzIGEgYmFzZSBjbGFzcyBmb3IgYmFja2JvbmUgbW9kZWxzIHRoYXQgdXNlIGJhY2tib25lIHBvdWNoLiBDb3VjaERCXHJcbi8vIGRvY3VtZW50cyBjb250YWluIGtleXMgdGhhdCB5b3UgbmVlZCB0byB3b3JrIHdpdGggdGhlIGRhdGFiYXNlLCBidXQgYXJlXHJcbi8vIGlycmVsZXZhbnQgdG8gdGhlIGRvbWFpbiBwdXJwb3NlIG9mIHRoZSBtb2RlbC5cclxuLy9cclxuLy8gSXQgc3RvcmVzIGFuIGFycmF5IG9mIHRoZXNlIGRvY3VtZW50IGtleXMgaW4gYHRoaXMuc2FmZWd1YXJkYC4gQnkgZGVmYXVsdCxcclxuLy8gdGhlIGFycmF5IGluY2x1ZGVzIGBfaWRgIGFuZCBgX3JldmAuIEhvd2V2ZXIsIHN1YmNsYXNzZXMgb2YgQ291Y2hNb2RlbFxyXG4vLyBtYXkgc3BlY2lmeSBtb3JlLlxyXG4vL1xyXG4vLyBPdGhlciBmdW5jdGlvbnMgbWF5IHVzZSBgdGhpcy5zYWZlZ3VhcmRgIGluIHRoZWlyIGxvZ2ljLiBGb3IgaW5zdGFuY2UsXHJcbi8vIHRoZSB2YWxpZGF0aW9uIG1peGluIGRvZXMgbm90IGNvbnNpZGVyIHNhZmVndWFyZGVkIGtleXMgaW4gbW9kZWwgdmFsaWRhdGlvbi5cclxuLy8gKG90aGVyd2lzZSB5b3Ugd291bGQgaGF2ZSB0byBpbmNsdWRlIF9pZCBhbmQgX3JldiBpbiB0aGUgc2NoZW1hIGZvciBhbGxcclxuLy8gbW9kZWxzKVxyXG5jb25zdCBzYWZlZ3VhcmQgPSBbICdfaWQnLCAnX3JldicgXTtcclxuXHJcbmV4cG9ydCBjb25zdCBDb3VjaE1vZGVsID0gUHJvbWlzZU1vZGVsLmV4dGVuZCgge1xyXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xyXG4gICAgUHJvbWlzZU1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuICAgIHRoaXMuc2FmZWd1YXJkID0gdW5pb24oIHNhZmVndWFyZCwgdGhpcy5zYWZlZ3VhcmQgKTtcclxuICB9XHJcbn0gKTtcclxuXHJcbmNvbnN0IF9hdHRhY2htZW50cyA9IGF0dGFjaG1lbnRzKCk7XHJcbmNvbnN0IF9hdHRhY2ggPSBfYXR0YWNobWVudHMuYXR0YWNoO1xyXG5fYXR0YWNobWVudHMuYXR0YWNoID0gZnVuY3Rpb24oIGJsb2IsIG5hbWUsIHR5cGUsIGRvbmUgKSB7XHJcbiAgbGV0IGFyZ3MgPSBbIGJsb2IgXTtcclxuICBpZiAoICFpc0Z1bmN0aW9uKCBuYW1lICkgKSB7XHJcbiAgICBhcmdzLnB1c2goIG5hbWUgKTtcclxuICAgIGlmICggIWlzRnVuY3Rpb24oIHR5cGUgKSApIHtcclxuICAgICAgYXJncy5wdXNoKCB0eXBlICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XHJcbiAgICBhcmdzLnB1c2goICggZXJyLCByZXN1bHQgKSA9PiB7XHJcbiAgICAgIGlmICggZXJyICkge1xyXG4gICAgICAgIHJlamVjdCggZXJyICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSggcmVzdWx0ICk7XHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuICAgIF9hdHRhY2guYXBwbHkoIHRoaXMsIGFyZ3MgKTtcclxuICB9ICk7XHJcbn07XHJcbmNvbnN0IF9hdHRhY2htZW50ID0gX2F0dGFjaG1lbnRzLmF0dGFjaG1lbnQ7XHJcbl9hdHRhY2htZW50cy5hdHRhY2htZW50ID0gZnVuY3Rpb24oIG5hbWUgKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcclxuICAgIGNvbnN0IGNhbGxiYWNrID0gKCBlcnIsIHJlc3VsdCApID0+IHtcclxuICAgICAgaWYgKCBlcnIgKSB7XHJcbiAgICAgICAgcmVqZWN0KCBlcnIgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKCByZXN1bHQgKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIF9hdHRhY2htZW50LmNhbGwoIHRoaXMsIG5hbWUsIGNhbGxiYWNrICk7XHJcbiAgfSApO1xyXG59O1xyXG5hc3NpZ24oIENvdWNoTW9kZWwucHJvdG90eXBlLCBfYXR0YWNobWVudHMgKTtcclxuXHJcbi8vICMjIENvdWNoIENvbGxlY3Rpb25cclxuLy8gQnkgZGVmYXVsdCwgYnRjLW1vZGVscyB1c2UgdGhlIGFsbERvY3MgbWV0aG9kIHdpdGggaW5jbHVkZV9kb2NzID0gdHJ1ZS5cclxuLy8gVGhlcmVmb3JlLCB3ZSBuZWVkIHRvIHBpY2sgdGhlIGRvY3VtZW50IG9iamVjdHMgaW4gdGhlIHJlc3BvbnNlIGFycmF5LlxyXG5leHBvcnQgY29uc3QgQ291Y2hDb2xsZWN0aW9uID0gUHJvbWlzZUNvbGxlY3Rpb24uZXh0ZW5kKCB7XHJcbiAgcGFyc2U6IGZ1bmN0aW9uKCByZXNwb25zZSwgb3B0aW9ucyApIHtcclxuICAgIHJldHVybiBtYXAoIHJlc3BvbnNlLnJvd3MsICdkb2MnICk7XHJcbiAgfVxyXG59ICk7XHJcbiJdfQ==
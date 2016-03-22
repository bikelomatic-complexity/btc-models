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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQTJCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7Ozs7O0FBQXBCLFNBQVMsV0FBVyxDQUFFLElBQUksRUFBRztBQUNsQyxTQUFPO0FBQ0wsWUFBUSxFQUFFLElBQUk7QUFDZCxVQUFNLEVBQUUsSUFBSSxHQUFHLEdBQVE7R0FDeEIsQ0FBQztDQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFlRCxJQUFNLFNBQVMsR0FBRyxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQzs7QUFFN0IsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLHNCQUFhLE1BQU0sQ0FBRTtBQUM3QyxZQUFVLEVBQUUsb0JBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUMxQywwQkFBYSxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDM0QsUUFBSSxDQUFDLFNBQVMsR0FBRyxtQkFBTyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO0dBQ3JEO0NBQ0YsQ0FBRSxDQUFDOztBQUVKLElBQU0sWUFBWSxHQUFHLGlDQUFhLENBQUM7QUFDbkMsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztBQUNwQyxZQUFZLENBQUMsTUFBTSxHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFHOzs7QUFDdkQsTUFBSSxJQUFJLEdBQUcsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUNwQixNQUFLLENBQUMsd0JBQVksSUFBSSxDQUFFLEVBQUc7QUFDekIsUUFBSSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUNsQixRQUFLLENBQUMsd0JBQVksSUFBSSxDQUFFLEVBQUc7QUFDekIsVUFBSSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztLQUNuQjtHQUNGO0FBQ0QsU0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFFLE9BQU8sRUFBRSxNQUFNLEVBQU07QUFDekMsUUFBSSxDQUFDLElBQUksQ0FBRSxVQUFFLEdBQUcsRUFBRSxNQUFNLEVBQU07QUFDNUIsVUFBSyxHQUFHLEVBQUc7QUFDVCxjQUFNLENBQUUsR0FBRyxDQUFFLENBQUM7T0FDZixNQUFNO0FBQ0wsZUFBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDO09BQ25CO0tBQ0YsQ0FBRSxDQUFDO0FBQ0osV0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUUsQ0FBQztHQUM3QixDQUFFLENBQUM7Q0FDTCxDQUFDO0FBQ0YsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUM1QyxZQUFZLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFHOzs7QUFDekMsU0FBTyxJQUFJLE9BQU8sQ0FBRSxVQUFFLE9BQU8sRUFBRSxNQUFNLEVBQU07QUFDekMsUUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUssR0FBRyxFQUFFLE1BQU0sRUFBTTtBQUNsQyxVQUFLLEdBQUcsRUFBRztBQUNULGNBQU0sQ0FBRSxHQUFHLENBQUUsQ0FBQztPQUNmLE1BQU07QUFDTCxlQUFPLENBQUUsTUFBTSxDQUFFLENBQUM7T0FDbkI7S0FDRixDQUFDO0FBQ0YsZUFBVyxDQUFDLElBQUksU0FBUSxJQUFJLEVBQUUsUUFBUSxDQUFFLENBQUM7R0FDMUMsQ0FBRSxDQUFDO0NBQ0wsQ0FBQztBQUNGLG9CQUFRLFVBQVUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFFOzs7OztBQUFDLEFBS3RDLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRywyQkFBa0IsTUFBTSxDQUFFO0FBQ3ZELE9BQUssRUFBRSxlQUFVLFFBQVEsRUFBRSxPQUFPLEVBQUc7QUFDbkMsV0FBTyxpQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBRSxDQUFDO0dBQ3BDO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IFByb21pc2VNb2RlbCwgUHJvbWlzZUNvbGxlY3Rpb24gfSBmcm9tICcuL3Byb21pc2UnO1xuXG5pbXBvcnQgeyBhdHRhY2htZW50cyB9IGZyb20gJ2JhY2tib25lLXBvdWNoJztcbmltcG9ydCB7IGFzc2lnbiwgdW5pb24sIG1hcCwgaXNGdW5jdGlvbiB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vICMga2V5c0JldHdlZW5cbi8vIEEgY29tbW9uIENvdWNoREIgcGF0dGVybiBpcyBxdWVyeWluZyBkb2N1bWVudHMgYnkga2V5cyBpbiBhIHJhbmdlLlxuLy8gVXNlIHdpdGhpbiBhIHBvdWNoIGNvbmZpZyBvYmplY3QgbGlrZTogYC4uLmtleXNCZXR3ZWVuKCAncG9pbnRzLycgKWBcbmV4cG9ydCBmdW5jdGlvbiBrZXlzQmV0d2VlbiggYmFzZSApIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydGtleTogYmFzZSxcbiAgICBlbmRrZXk6IGJhc2UgKyAnXFx1ZmZmZidcbiAgfTtcbn1cblxuLy8gIyBDb3VjaE1vZGVsXG4vLyBUaGlzIGlzIGEgYmFzZSBjbGFzcyBmb3IgYmFja2JvbmUgbW9kZWxzIHRoYXQgdXNlIGJhY2tib25lIHBvdWNoLiBDb3VjaERCXG4vLyBkb2N1bWVudHMgY29udGFpbiBrZXlzIHRoYXQgeW91IG5lZWQgdG8gd29yayB3aXRoIHRoZSBkYXRhYmFzZSwgYnV0IGFyZVxuLy8gaXJyZWxldmFudCB0byB0aGUgZG9tYWluIHB1cnBvc2Ugb2YgdGhlIG1vZGVsLlxuLy9cbi8vIEl0IHN0b3JlcyBhbiBhcnJheSBvZiB0aGVzZSBkb2N1bWVudCBrZXlzIGluIGB0aGlzLnNhZmVndWFyZGAuIEJ5IGRlZmF1bHQsXG4vLyB0aGUgYXJyYXkgaW5jbHVkZXMgYF9pZGAgYW5kIGBfcmV2YC4gSG93ZXZlciwgc3ViY2xhc3NlcyBvZiBDb3VjaE1vZGVsXG4vLyBtYXkgc3BlY2lmeSBtb3JlLlxuLy9cbi8vIE90aGVyIGZ1bmN0aW9ucyBtYXkgdXNlIGB0aGlzLnNhZmVndWFyZGAgaW4gdGhlaXIgbG9naWMuIEZvciBpbnN0YW5jZSxcbi8vIHRoZSB2YWxpZGF0aW9uIG1peGluIGRvZXMgbm90IGNvbnNpZGVyIHNhZmVndWFyZGVkIGtleXMgaW4gbW9kZWwgdmFsaWRhdGlvbi5cbi8vIChvdGhlcndpc2UgeW91IHdvdWxkIGhhdmUgdG8gaW5jbHVkZSBfaWQgYW5kIF9yZXYgaW4gdGhlIHNjaGVtYSBmb3IgYWxsXG4vLyBtb2RlbHMpXG5jb25zdCBzYWZlZ3VhcmQgPSBbICdfaWQnLCAnX3JldicgXTtcblxuZXhwb3J0IGNvbnN0IENvdWNoTW9kZWwgPSBQcm9taXNlTW9kZWwuZXh0ZW5kKCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIFByb21pc2VNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgdGhpcy5zYWZlZ3VhcmQgPSB1bmlvbiggc2FmZWd1YXJkLCB0aGlzLnNhZmVndWFyZCApO1xuICB9XG59ICk7XG5cbmNvbnN0IF9hdHRhY2htZW50cyA9IGF0dGFjaG1lbnRzKCk7XG5jb25zdCBfYXR0YWNoID0gX2F0dGFjaG1lbnRzLmF0dGFjaDtcbl9hdHRhY2htZW50cy5hdHRhY2ggPSBmdW5jdGlvbiggYmxvYiwgbmFtZSwgdHlwZSwgZG9uZSApIHtcbiAgbGV0IGFyZ3MgPSBbIGJsb2IgXTtcbiAgaWYgKCAhaXNGdW5jdGlvbiggbmFtZSApICkge1xuICAgIGFyZ3MucHVzaCggbmFtZSApO1xuICAgIGlmICggIWlzRnVuY3Rpb24oIHR5cGUgKSApIHtcbiAgICAgIGFyZ3MucHVzaCggdHlwZSApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgIGFyZ3MucHVzaCggKCBlcnIsIHJlc3VsdCApID0+IHtcbiAgICAgIGlmICggZXJyICkge1xuICAgICAgICByZWplY3QoIGVyciApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSggcmVzdWx0ICk7XG4gICAgICB9XG4gICAgfSApO1xuICAgIF9hdHRhY2guYXBwbHkoIHRoaXMsIGFyZ3MgKTtcbiAgfSApO1xufTtcbmNvbnN0IF9hdHRhY2htZW50ID0gX2F0dGFjaG1lbnRzLmF0dGFjaG1lbnQ7XG5fYXR0YWNobWVudHMuYXR0YWNobWVudCA9IGZ1bmN0aW9uKCBuYW1lICkge1xuICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKCBlcnIsIHJlc3VsdCApID0+IHtcbiAgICAgIGlmICggZXJyICkge1xuICAgICAgICByZWplY3QoIGVyciApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSggcmVzdWx0ICk7XG4gICAgICB9XG4gICAgfTtcbiAgICBfYXR0YWNobWVudC5jYWxsKCB0aGlzLCBuYW1lLCBjYWxsYmFjayApO1xuICB9ICk7XG59O1xuYXNzaWduKCBDb3VjaE1vZGVsLnByb3RvdHlwZSwgX2F0dGFjaG1lbnRzICk7XG5cbi8vICMjIENvdWNoIENvbGxlY3Rpb25cbi8vIEJ5IGRlZmF1bHQsIGJ0Yy1tb2RlbHMgdXNlIHRoZSBhbGxEb2NzIG1ldGhvZCB3aXRoIGluY2x1ZGVfZG9jcyA9IHRydWUuXG4vLyBUaGVyZWZvcmUsIHdlIG5lZWQgdG8gcGljayB0aGUgZG9jdW1lbnQgb2JqZWN0cyBpbiB0aGUgcmVzcG9uc2UgYXJyYXkuXG5leHBvcnQgY29uc3QgQ291Y2hDb2xsZWN0aW9uID0gUHJvbWlzZUNvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIHBhcnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIG1hcCggcmVzcG9uc2Uucm93cywgJ2RvYycgKTtcbiAgfVxufSApO1xuIl19
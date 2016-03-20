'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;
exports.keysBetween = keysBetween;

var _promise = require('./promise');

var _lodash = require('lodash');

// # keysBetween
// A common CouchDB pattern is querying documents by keys in a range.
// Use within a pouch config object like: `...keysBetween( 'points/' )`
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
var safeguard = ['_id', '_rev'];

var CouchModel = exports.CouchModel = _promise.PromiseModel.extend({
  initialize: function initialize(attributes, options) {
    _promise.PromiseModel.prototype.initialize.apply(this, arguments);
    this.safeguard = (0, _lodash.union)(safeguard, this.safeguard);
  }
});

// ## Couch Collection
// By default, btc-models use the allDocs method with include_docs = true.
// Therefore, we need to pick the document objects in the response array.
var CouchCollection = exports.CouchCollection = _promise.PromiseCollection.extend({
  parse: function parse(response, options) {
    return (0, _lodash.map)(response.rows, 'doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQXlCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcEIsU0FBUyxXQUFXLENBQUUsSUFBSSxFQUFHO0FBQ2xDLFNBQU87QUFDTCxZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxJQUFJLEdBQUcsR0FBUTtHQUN4QixDQUFDO0NBQ0g7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBZUQsSUFBTSxTQUFTLEdBQUcsQ0FBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUM7O0FBRTdCLElBQU0sVUFBVSxXQUFWLFVBQVUsR0FBRyxzQkFBYSxNQUFNLENBQUU7QUFDN0MsWUFBVSxFQUFFLG9CQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDMUMsMEJBQWEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQzNELFFBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQU8sU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztHQUNyRDtDQUNGLENBQUU7Ozs7O0FBQUMsQUFLRyxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcsMkJBQWtCLE1BQU0sQ0FBRTtBQUN2RCxPQUFLLEVBQUUsZUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFHO0FBQ25DLFdBQU8saUJBQUssUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUUsQ0FBQztHQUNwQztDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBQcm9taXNlTW9kZWwsIFByb21pc2VDb2xsZWN0aW9uIH0gZnJvbSAnLi9wcm9taXNlJztcbmltcG9ydCB7IHVuaW9uLCBtYXAgfSBmcm9tICdsb2Rhc2gnO1xuXG4vLyAjIGtleXNCZXR3ZWVuXG4vLyBBIGNvbW1vbiBDb3VjaERCIHBhdHRlcm4gaXMgcXVlcnlpbmcgZG9jdW1lbnRzIGJ5IGtleXMgaW4gYSByYW5nZS5cbi8vIFVzZSB3aXRoaW4gYSBwb3VjaCBjb25maWcgb2JqZWN0IGxpa2U6IGAuLi5rZXlzQmV0d2VlbiggJ3BvaW50cy8nIClgXG5leHBvcnQgZnVuY3Rpb24ga2V5c0JldHdlZW4oIGJhc2UgKSB7XG4gIHJldHVybiB7XG4gICAgc3RhcnRrZXk6IGJhc2UsXG4gICAgZW5ka2V5OiBiYXNlICsgJ1xcdWZmZmYnXG4gIH07XG59XG5cbi8vICMgQ291Y2hNb2RlbFxuLy8gVGhpcyBpcyBhIGJhc2UgY2xhc3MgZm9yIGJhY2tib25lIG1vZGVscyB0aGF0IHVzZSBiYWNrYm9uZSBwb3VjaC4gQ291Y2hEQlxuLy8gZG9jdW1lbnRzIGNvbnRhaW4ga2V5cyB0aGF0IHlvdSBuZWVkIHRvIHdvcmsgd2l0aCB0aGUgZGF0YWJhc2UsIGJ1dCBhcmVcbi8vIGlycmVsZXZhbnQgdG8gdGhlIGRvbWFpbiBwdXJwb3NlIG9mIHRoZSBtb2RlbC5cbi8vXG4vLyBJdCBzdG9yZXMgYW4gYXJyYXkgb2YgdGhlc2UgZG9jdW1lbnQga2V5cyBpbiBgdGhpcy5zYWZlZ3VhcmRgLiBCeSBkZWZhdWx0LFxuLy8gdGhlIGFycmF5IGluY2x1ZGVzIGBfaWRgIGFuZCBgX3JldmAuIEhvd2V2ZXIsIHN1YmNsYXNzZXMgb2YgQ291Y2hNb2RlbFxuLy8gbWF5IHNwZWNpZnkgbW9yZS5cbi8vXG4vLyBPdGhlciBmdW5jdGlvbnMgbWF5IHVzZSBgdGhpcy5zYWZlZ3VhcmRgIGluIHRoZWlyIGxvZ2ljLiBGb3IgaW5zdGFuY2UsXG4vLyB0aGUgdmFsaWRhdGlvbiBtaXhpbiBkb2VzIG5vdCBjb25zaWRlciBzYWZlZ3VhcmRlZCBrZXlzIGluIG1vZGVsIHZhbGlkYXRpb24uXG4vLyAob3RoZXJ3aXNlIHlvdSB3b3VsZCBoYXZlIHRvIGluY2x1ZGUgX2lkIGFuZCBfcmV2IGluIHRoZSBzY2hlbWEgZm9yIGFsbFxuLy8gbW9kZWxzKVxuY29uc3Qgc2FmZWd1YXJkID0gWyAnX2lkJywgJ19yZXYnIF07XG5cbmV4cG9ydCBjb25zdCBDb3VjaE1vZGVsID0gUHJvbWlzZU1vZGVsLmV4dGVuZCgge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBQcm9taXNlTW9kZWwucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMuc2FmZWd1YXJkID0gdW5pb24oIHNhZmVndWFyZCwgdGhpcy5zYWZlZ3VhcmQgKTtcbiAgfVxufSApO1xuXG4vLyAjIyBDb3VjaCBDb2xsZWN0aW9uXG4vLyBCeSBkZWZhdWx0LCBidGMtbW9kZWxzIHVzZSB0aGUgYWxsRG9jcyBtZXRob2Qgd2l0aCBpbmNsdWRlX2RvY3MgPSB0cnVlLlxuLy8gVGhlcmVmb3JlLCB3ZSBuZWVkIHRvIHBpY2sgdGhlIGRvY3VtZW50IG9iamVjdHMgaW4gdGhlIHJlc3BvbnNlIGFycmF5LlxuZXhwb3J0IGNvbnN0IENvdWNoQ29sbGVjdGlvbiA9IFByb21pc2VDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBwYXJzZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBvcHRpb25zICkge1xuICAgIHJldHVybiBtYXAoIHJlc3BvbnNlLnJvd3MsICdkb2MnICk7XG4gIH1cbn0gKTtcbiJdfQ==
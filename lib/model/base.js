'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;
exports.keysBetween = keysBetween;

var _backbone = require('backbone');

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

var CouchModel = exports.CouchModel = _backbone.Model.extend({
  initialize: function initialize(attributes, options) {
    _backbone.Model.prototype.initialize.apply(this, arguments);
    this.safeguard = (0, _lodash.union)(safeguard, this.safeguard);
  }
});

// ## Couch Collection
// By default, btc-models use the allDocs method with include_docs = true.
// Therefore, we need to pick the document objects in the response array.
var CouchCollection = exports.CouchCollection = _backbone.Collection.extend({
  parse: function parse(response, options) {
    return (0, _lodash.map)(response.rows, 'doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQXlCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcEIsU0FBUyxXQUFXLENBQUUsSUFBSSxFQUFHO0FBQ2xDLFNBQU87QUFDTCxZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxJQUFJLEdBQUcsR0FBUTtHQUN4QixDQUFDO0NBQ0g7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBZUQsSUFBTSxTQUFTLEdBQUcsQ0FBRSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBQUM7O0FBRTdCLElBQU0sVUFBVSxXQUFWLFVBQVUsR0FBRyxnQkFBTSxNQUFNLENBQUU7QUFDdEMsWUFBVSxFQUFFLG9CQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDMUMsb0JBQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQ3BELFFBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQU8sU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztHQUNyRDtDQUNGLENBQUU7Ozs7O0FBQUMsQUFLRyxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcscUJBQVcsTUFBTSxDQUFFO0FBQ2hELE9BQUssRUFBRSxlQUFVLFFBQVEsRUFBRSxPQUFPLEVBQUc7QUFDbkMsV0FBTyxpQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBRSxDQUFDO0dBQ3BDO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE1vZGVsLCBDb2xsZWN0aW9uIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHsgdW5pb24sIG1hcCB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vICMga2V5c0JldHdlZW5cbi8vIEEgY29tbW9uIENvdWNoREIgcGF0dGVybiBpcyBxdWVyeWluZyBkb2N1bWVudHMgYnkga2V5cyBpbiBhIHJhbmdlLlxuLy8gVXNlIHdpdGhpbiBhIHBvdWNoIGNvbmZpZyBvYmplY3QgbGlrZTogYC4uLmtleXNCZXR3ZWVuKCAncG9pbnRzLycgKWBcbmV4cG9ydCBmdW5jdGlvbiBrZXlzQmV0d2VlbiggYmFzZSApIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydGtleTogYmFzZSxcbiAgICBlbmRrZXk6IGJhc2UgKyAnXFx1ZmZmZidcbiAgfTtcbn1cblxuLy8gIyBDb3VjaE1vZGVsXG4vLyBUaGlzIGlzIGEgYmFzZSBjbGFzcyBmb3IgYmFja2JvbmUgbW9kZWxzIHRoYXQgdXNlIGJhY2tib25lIHBvdWNoLiBDb3VjaERCXG4vLyBkb2N1bWVudHMgY29udGFpbiBrZXlzIHRoYXQgeW91IG5lZWQgdG8gd29yayB3aXRoIHRoZSBkYXRhYmFzZSwgYnV0IGFyZVxuLy8gaXJyZWxldmFudCB0byB0aGUgZG9tYWluIHB1cnBvc2Ugb2YgdGhlIG1vZGVsLlxuLy9cbi8vIEl0IHN0b3JlcyBhbiBhcnJheSBvZiB0aGVzZSBkb2N1bWVudCBrZXlzIGluIGB0aGlzLnNhZmVndWFyZGAuIEJ5IGRlZmF1bHQsXG4vLyB0aGUgYXJyYXkgaW5jbHVkZXMgYF9pZGAgYW5kIGBfcmV2YC4gSG93ZXZlciwgc3ViY2xhc3NlcyBvZiBDb3VjaE1vZGVsXG4vLyBtYXkgc3BlY2lmeSBtb3JlLlxuLy9cbi8vIE90aGVyIGZ1bmN0aW9ucyBtYXkgdXNlIGB0aGlzLnNhZmVndWFyZGAgaW4gdGhlaXIgbG9naWMuIEZvciBpbnN0YW5jZSxcbi8vIHRoZSB2YWxpZGF0aW9uIG1peGluIGRvZXMgbm90IGNvbnNpZGVyIHNhZmVndWFyZGVkIGtleXMgaW4gbW9kZWwgdmFsaWRhdGlvbi5cbi8vIChvdGhlcndpc2UgeW91IHdvdWxkIGhhdmUgdG8gaW5jbHVkZSBfaWQgYW5kIF9yZXYgaW4gdGhlIHNjaGVtYSBmb3IgYWxsXG4vLyBtb2RlbHMpXG5jb25zdCBzYWZlZ3VhcmQgPSBbICdfaWQnLCAnX3JldicgXTtcblxuZXhwb3J0IGNvbnN0IENvdWNoTW9kZWwgPSBNb2RlbC5leHRlbmQoIHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgTW9kZWwucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIHRoaXMuc2FmZWd1YXJkID0gdW5pb24oIHNhZmVndWFyZCwgdGhpcy5zYWZlZ3VhcmQgKTtcbiAgfVxufSApO1xuXG4vLyAjIyBDb3VjaCBDb2xsZWN0aW9uXG4vLyBCeSBkZWZhdWx0LCBidGMtbW9kZWxzIHVzZSB0aGUgYWxsRG9jcyBtZXRob2Qgd2l0aCBpbmNsdWRlX2RvY3MgPSB0cnVlLlxuLy8gVGhlcmVmb3JlLCB3ZSBuZWVkIHRvIHBpY2sgdGhlIGRvY3VtZW50IG9iamVjdHMgaW4gdGhlIHJlc3BvbnNlIGFycmF5LlxuZXhwb3J0IGNvbnN0IENvdWNoQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKCB7XG4gIHBhcnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIG1hcCggcmVzcG9uc2Uucm93cywgJ2RvYycgKTtcbiAgfVxufSApO1xuIl19
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;
exports.keysBetween = keysBetween;

var _backbone = require('backbone');

var _underscore = require('underscore');

var _lodash = require('lodash');

function keysBetween(base) {
  return {
    startkey: base,
    endkey: base + '￿'
  };
}

// Special keys that are reserved by serialized CouchDB documents
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

var baseSafeguard = ['_id', '_rev'];

// ## Couch Model
// This base class ensures the client will not unknowingly modify the special
// keys of a CouchDB document.
var CouchModel = exports.CouchModel = _backbone.Model.extend({
  // By default, `CouchModel` safeguards `_id` and `_rev`. You can extend
  // this list of safeguarded keys by passing an array in `options.special`.
  initialize: function initialize(attributes, options) {
    _backbone.Model.prototype.initialize.apply(this, arguments);

    if (this.safeguard && (0, _underscore.isArray)(this.safeguard)) {
      this.safeguard = (0, _underscore.union)(baseSafeguard, this.safeguard);
    } else {
      this.safeguard = baseSafeguard;
    }
  }
});

// ## Couch Collection
// This base collection class helps the CouchModel to prevent the client
// from unknowingly modifying the special keys of a CouchDB document.
var CouchCollection = exports.CouchCollection = _backbone.Collection.extend({
  parse: function parse(response, options) {
    return (0, _lodash.map)(response.rows, 'doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQXdCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7O0FBQXBCLFNBQVMsV0FBVyxDQUFFLElBQUksRUFBRztBQUNsQyxTQUFPO0FBQ0wsWUFBUSxFQUFFLElBQUk7QUFDZCxVQUFNLEVBQUUsSUFBSSxHQUFHLEdBQVE7R0FDeEIsQ0FBQztDQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFHRCxJQUFNLGFBQWEsR0FBRyxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUU7Ozs7O0FBQUMsQUFLakMsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLGdCQUFNLE1BQU0sQ0FBRTs7O0FBR3RDLFlBQVUsRUFBRSxvQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQzFDLG9CQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUUsQ0FBQzs7QUFFcEQsUUFBSyxJQUFJLENBQUMsU0FBUyxJQUFJLHlCQUFTLElBQUksQ0FBQyxTQUFTLENBQUUsRUFBRztBQUNqRCxVQUFJLENBQUMsU0FBUyxHQUFHLHVCQUFPLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFLENBQUM7S0FDekQsTUFBTTtBQUNMLFVBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0tBQ2hDO0dBQ0Y7Q0FDRixDQUFFOzs7OztBQUFDLEFBS0csSUFBTSxlQUFlLFdBQWYsZUFBZSxHQUFHLHFCQUFXLE1BQU0sQ0FBRTtBQUNoRCxPQUFLLEVBQUUsZUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFHO0FBQ25DLFdBQU8saUJBQUssUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUUsQ0FBQztHQUNwQztDQUNGLENBQUUsQ0FBQyIsImZpbGUiOiJiYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgeyBNb2RlbCwgQ29sbGVjdGlvbiB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCB7IHVuaW9uLCBpc0FycmF5IH0gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlzQmV0d2VlbiggYmFzZSApIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydGtleTogYmFzZSxcbiAgICBlbmRrZXk6IGJhc2UgKyAnXFx1ZmZmZidcbiAgfTtcbn1cblxuLy8gU3BlY2lhbCBrZXlzIHRoYXQgYXJlIHJlc2VydmVkIGJ5IHNlcmlhbGl6ZWQgQ291Y2hEQiBkb2N1bWVudHNcbmNvbnN0IGJhc2VTYWZlZ3VhcmQgPSBbICdfaWQnLCAnX3JldicgXTtcblxuLy8gIyMgQ291Y2ggTW9kZWxcbi8vIFRoaXMgYmFzZSBjbGFzcyBlbnN1cmVzIHRoZSBjbGllbnQgd2lsbCBub3QgdW5rbm93aW5nbHkgbW9kaWZ5IHRoZSBzcGVjaWFsXG4vLyBrZXlzIG9mIGEgQ291Y2hEQiBkb2N1bWVudC5cbmV4cG9ydCBjb25zdCBDb3VjaE1vZGVsID0gTW9kZWwuZXh0ZW5kKCB7XG4gIC8vIEJ5IGRlZmF1bHQsIGBDb3VjaE1vZGVsYCBzYWZlZ3VhcmRzIGBfaWRgIGFuZCBgX3JldmAuIFlvdSBjYW4gZXh0ZW5kXG4gIC8vIHRoaXMgbGlzdCBvZiBzYWZlZ3VhcmRlZCBrZXlzIGJ5IHBhc3NpbmcgYW4gYXJyYXkgaW4gYG9wdGlvbnMuc3BlY2lhbGAuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgIGlmICggdGhpcy5zYWZlZ3VhcmQgJiYgaXNBcnJheSggdGhpcy5zYWZlZ3VhcmQgKSApIHtcbiAgICAgIHRoaXMuc2FmZWd1YXJkID0gdW5pb24oIGJhc2VTYWZlZ3VhcmQsIHRoaXMuc2FmZWd1YXJkICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2FmZWd1YXJkID0gYmFzZVNhZmVndWFyZDtcbiAgICB9XG4gIH1cbn0gKTtcblxuLy8gIyMgQ291Y2ggQ29sbGVjdGlvblxuLy8gVGhpcyBiYXNlIGNvbGxlY3Rpb24gY2xhc3MgaGVscHMgdGhlIENvdWNoTW9kZWwgdG8gcHJldmVudCB0aGUgY2xpZW50XG4vLyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZyB0aGUgc3BlY2lhbCBrZXlzIG9mIGEgQ291Y2hEQiBkb2N1bWVudC5cbmV4cG9ydCBjb25zdCBDb3VjaENvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCgge1xuICBwYXJzZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBvcHRpb25zICkge1xuICAgIHJldHVybiBtYXAoIHJlc3BvbnNlLnJvd3MsICdkb2MnICk7XG4gIH1cbn0gKTtcbiJdfQ==
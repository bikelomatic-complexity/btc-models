'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;
exports.keysBetween = keysBetween;

var _backbone = require('backbone');

var _underscore = require('underscore');

var _lodash = require('lodash');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /* btc-app-server -- Server for the Bicycle Touring Companion
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

// Special keys that are reserved by serialized CouchDB documents
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
  },

  // When fetching a single document, allow overriding safeguarded Couch keys
  fetch: function fetch(options) {
    return _backbone.Model.prototype.fetch.call(this, (0, _underscore.extend)({}, options, {
      force: true
    }));
  },

  // Override Backbone's set function to ignore all the special keys, *unless
  // our custom force option is set to true*.
  set: function set(key, val, options) {

    // We reuse Backbone's argument normalization code
    if (key == null) return this;

    var attrs = undefined;
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }

    options || (options = {});

    if (!options.force) {
      // Uncomment to log keys that we omit from super.set()
      var omitted = (0, _underscore.intersection)((0, _underscore.keys)(attrs), this.safeguard);

      // Actually omit safeguarded keys
      attrs = (0, _underscore.omit)(attrs, this.safeguard);

      if (omitted.length > 0) {
        throw new Error('attempted override of safeguarded keys: ' + omitted.toString());
      }
    }

    return _backbone.Model.prototype.set.call(this, attrs, options);
  }
});

// ## Couch Collection
// This base collection class helps the CouchModel to prevent the client
// from unknowingly modifying the special keys of a CouchDB document.
var CouchCollection = exports.CouchCollection = _backbone.Collection.extend({

  // When fetching multiple documents, allow overriding safeguarded Couch keys
  fetch: function fetch(options) {
    return _backbone.Collection.prototype.fetch.call(this, (0, _underscore.extend)({}, options, {
      force: true
    }));
  },

  parse: function parse(response, options) {
    return (0, _lodash.map)(response.rows, 'doc');
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQXdCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFwQixTQUFTLFdBQVcsQ0FBRSxJQUFJLEVBQUc7QUFDbEMsU0FBTztBQUNMLFlBQVEsRUFBRSxJQUFJO0FBQ2QsVUFBTSxFQUFFLElBQUksR0FBRyxHQUFRO0dBQ3hCLENBQUM7Q0FDSDs7O0FBQUEsQUFHRCxJQUFNLGFBQWEsR0FBRyxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUU7Ozs7O0FBQUMsQUFLakMsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLGdCQUFNLE1BQU0sQ0FBRTs7OztBQUl0QyxZQUFVLEVBQUUsb0JBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUMxQyxvQkFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7O0FBRXBELFFBQUssSUFBSSxDQUFDLFNBQVMsSUFBSSx5QkFBUyxJQUFJLENBQUMsU0FBUyxDQUFFLEVBQUc7QUFDakQsVUFBSSxDQUFDLFNBQVMsR0FBRyx1QkFBTyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO0tBQ3pELE1BQU07QUFDTCxVQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztLQUNoQztHQUNGOzs7QUFHRCxPQUFLLEVBQUUsZUFBVSxPQUFPLEVBQUc7QUFDekIsV0FBTyxnQkFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLEVBQUUsd0JBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUM1RCxXQUFLLEVBQUUsSUFBSTtLQUNaLENBQUUsQ0FBRSxDQUFDO0dBQ1A7Ozs7QUFJRCxLQUFHLEVBQUUsYUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRzs7O0FBR2pDLFFBQUssR0FBRyxJQUFJLElBQUksRUFBRyxPQUFPLElBQUksQ0FBQzs7QUFFL0IsUUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFFBQUssUUFBTyxHQUFHLHlDQUFILEdBQUcsT0FBSyxRQUFRLEVBQUc7QUFDN0IsV0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNaLGFBQU8sR0FBRyxHQUFHLENBQUM7S0FDZixNQUFNO0FBQ0wsT0FBRSxLQUFLLEdBQUcsRUFBRSxDQUFBLENBQUksR0FBRyxDQUFFLEdBQUcsR0FBRyxDQUFDO0tBQzdCOztBQUVELFdBQU8sS0FBTSxPQUFPLEdBQUcsRUFBRSxDQUFBLEFBQUUsQ0FBQzs7QUFFNUIsUUFBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUc7O0FBRXBCLFVBQU0sT0FBTyxHQUFHLDhCQUFjLHNCQUFNLEtBQUssQ0FBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUU7OztBQUFDLEFBRzlELFdBQUssR0FBRyxzQkFBTSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDOztBQUV0QyxVQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFHO0FBQ3hCLGNBQU0sSUFBSSxLQUFLLENBQUUsMENBQTBDLEdBQ3pELE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBRSxDQUFDO09BQ3hCO0tBQ0Y7O0FBRUQsV0FBTyxnQkFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBRSxDQUFDO0dBQ3pEO0NBQ0YsQ0FBRTs7Ozs7QUFBQyxBQUtHLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxxQkFBVyxNQUFNLENBQUU7OztBQUdoRCxPQUFLLEVBQUUsZUFBVSxPQUFPLEVBQUc7QUFDekIsV0FBTyxxQkFBVyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLEVBQUUsd0JBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNqRSxXQUFLLEVBQUUsSUFBSTtLQUNaLENBQUUsQ0FBRSxDQUFDO0dBQ1A7O0FBRUQsT0FBSyxFQUFFLGVBQVUsUUFBUSxFQUFFLE9BQU8sRUFBRztBQUNuQyxXQUFPLGlCQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFFLENBQUM7R0FDcEM7Q0FDRixDQUFFLENBQUMiLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgTW9kZWwsIENvbGxlY3Rpb24gfSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgeyBvbWl0LCB1bmlvbiwgaXNBcnJheSwgaW50ZXJzZWN0aW9uLCBrZXlzLCBleHRlbmQgfSBmcm9tICd1bmRlcnNjb3JlJztcblxuaW1wb3J0IHsgbWFwIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIGtleXNCZXR3ZWVuKCBiYXNlICkge1xuICByZXR1cm4ge1xuICAgIHN0YXJ0a2V5OiBiYXNlLFxuICAgIGVuZGtleTogYmFzZSArICdcXHVmZmZmJ1xuICB9O1xufVxuXG4vLyBTcGVjaWFsIGtleXMgdGhhdCBhcmUgcmVzZXJ2ZWQgYnkgc2VyaWFsaXplZCBDb3VjaERCIGRvY3VtZW50c1xuY29uc3QgYmFzZVNhZmVndWFyZCA9IFsgJ19pZCcsICdfcmV2JyBdO1xuXG4vLyAjIyBDb3VjaCBNb2RlbFxuLy8gVGhpcyBiYXNlIGNsYXNzIGVuc3VyZXMgdGhlIGNsaWVudCB3aWxsIG5vdCB1bmtub3dpbmdseSBtb2RpZnkgdGhlIHNwZWNpYWxcbi8vIGtleXMgb2YgYSBDb3VjaERCIGRvY3VtZW50LlxuZXhwb3J0IGNvbnN0IENvdWNoTW9kZWwgPSBNb2RlbC5leHRlbmQoIHtcblxuICAvLyBCeSBkZWZhdWx0LCBgQ291Y2hNb2RlbGAgc2FmZWd1YXJkcyBgX2lkYCBhbmQgYF9yZXZgLiBZb3UgY2FuIGV4dGVuZFxuICAvLyB0aGlzIGxpc3Qgb2Ygc2FmZWd1YXJkZWQga2V5cyBieSBwYXNzaW5nIGFuIGFycmF5IGluIGBvcHRpb25zLnNwZWNpYWxgLlxuICBpbml0aWFsaXplOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICBNb2RlbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cbiAgICBpZiAoIHRoaXMuc2FmZWd1YXJkICYmIGlzQXJyYXkoIHRoaXMuc2FmZWd1YXJkICkgKSB7XG4gICAgICB0aGlzLnNhZmVndWFyZCA9IHVuaW9uKCBiYXNlU2FmZWd1YXJkLCB0aGlzLnNhZmVndWFyZCApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNhZmVndWFyZCA9IGJhc2VTYWZlZ3VhcmQ7XG4gICAgfVxuICB9LFxuXG4gIC8vIFdoZW4gZmV0Y2hpbmcgYSBzaW5nbGUgZG9jdW1lbnQsIGFsbG93IG92ZXJyaWRpbmcgc2FmZWd1YXJkZWQgQ291Y2gga2V5c1xuICBmZXRjaDogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIE1vZGVsLnByb3RvdHlwZS5mZXRjaC5jYWxsKCB0aGlzLCBleHRlbmQoIHt9LCBvcHRpb25zLCB7XG4gICAgICBmb3JjZTogdHJ1ZVxuICAgIH0gKSApO1xuICB9LFxuXG4gIC8vIE92ZXJyaWRlIEJhY2tib25lJ3Mgc2V0IGZ1bmN0aW9uIHRvIGlnbm9yZSBhbGwgdGhlIHNwZWNpYWwga2V5cywgKnVubGVzc1xuICAvLyBvdXIgY3VzdG9tIGZvcmNlIG9wdGlvbiBpcyBzZXQgdG8gdHJ1ZSouXG4gIHNldDogZnVuY3Rpb24oIGtleSwgdmFsLCBvcHRpb25zICkge1xuXG4gICAgLy8gV2UgcmV1c2UgQmFja2JvbmUncyBhcmd1bWVudCBub3JtYWxpemF0aW9uIGNvZGVcbiAgICBpZiAoIGtleSA9PSBudWxsICkgcmV0dXJuIHRoaXM7XG5cbiAgICBsZXQgYXR0cnM7XG4gICAgaWYgKCB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyApIHtcbiAgICAgIGF0dHJzID0ga2V5O1xuICAgICAgb3B0aW9ucyA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgKCBhdHRycyA9IHt9IClbIGtleSBdID0gdmFsO1xuICAgIH1cblxuICAgIG9wdGlvbnMgfHwgKCBvcHRpb25zID0ge30gKTtcblxuICAgIGlmICggIW9wdGlvbnMuZm9yY2UgKSB7XG4gICAgICAvLyBVbmNvbW1lbnQgdG8gbG9nIGtleXMgdGhhdCB3ZSBvbWl0IGZyb20gc3VwZXIuc2V0KClcbiAgICAgIGNvbnN0IG9taXR0ZWQgPSBpbnRlcnNlY3Rpb24oIGtleXMoIGF0dHJzICksIHRoaXMuc2FmZWd1YXJkICk7XG5cbiAgICAgIC8vIEFjdHVhbGx5IG9taXQgc2FmZWd1YXJkZWQga2V5c1xuICAgICAgYXR0cnMgPSBvbWl0KCBhdHRycywgdGhpcy5zYWZlZ3VhcmQgKTtcblxuICAgICAgaWYgKCBvbWl0dGVkLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ2F0dGVtcHRlZCBvdmVycmlkZSBvZiBzYWZlZ3VhcmRlZCBrZXlzOiAnICtcbiAgICAgICAgICBvbWl0dGVkLnRvU3RyaW5nKCkgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTW9kZWwucHJvdG90eXBlLnNldC5jYWxsKCB0aGlzLCBhdHRycywgb3B0aW9ucyApO1xuICB9XG59ICk7XG5cbi8vICMjIENvdWNoIENvbGxlY3Rpb25cbi8vIFRoaXMgYmFzZSBjb2xsZWN0aW9uIGNsYXNzIGhlbHBzIHRoZSBDb3VjaE1vZGVsIHRvIHByZXZlbnQgdGhlIGNsaWVudFxuLy8gZnJvbSB1bmtub3dpbmdseSBtb2RpZnlpbmcgdGhlIHNwZWNpYWwga2V5cyBvZiBhIENvdWNoREIgZG9jdW1lbnQuXG5leHBvcnQgY29uc3QgQ291Y2hDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoIHtcblxuICAvLyBXaGVuIGZldGNoaW5nIG11bHRpcGxlIGRvY3VtZW50cywgYWxsb3cgb3ZlcnJpZGluZyBzYWZlZ3VhcmRlZCBDb3VjaCBrZXlzXG4gIGZldGNoOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcbiAgICByZXR1cm4gQ29sbGVjdGlvbi5wcm90b3R5cGUuZmV0Y2guY2FsbCggdGhpcywgZXh0ZW5kKCB7fSwgb3B0aW9ucywge1xuICAgICAgZm9yY2U6IHRydWVcbiAgICB9ICkgKTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24oIHJlc3BvbnNlLCBvcHRpb25zICkge1xuICAgIHJldHVybiBtYXAoIHJlc3BvbnNlLnJvd3MsICdkb2MnICk7XG4gIH1cbn0gKTtcbiJdfQ==
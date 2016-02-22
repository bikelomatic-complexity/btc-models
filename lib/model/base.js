'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchCollection = exports.CouchModel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* btc-app-server -- Server for the Bicycle Touring Companion
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

var _backbone = require('backbone');

var _underscore = require('underscore');

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
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBTSxnQkFBZ0IsQ0FBRSxLQUFGLEVBQVMsTUFBVCxDQUFoQjs7Ozs7QUFLQyxJQUFNLGtDQUFhLGdCQUFNLE1BQU4sQ0FBYzs7OztBQUl0QyxjQUFZLG9CQUFVLFVBQVYsRUFBc0IsT0FBdEIsRUFBZ0M7QUFDMUMsb0JBQU0sU0FBTixDQUFnQixVQUFoQixDQUEyQixLQUEzQixDQUFrQyxJQUFsQyxFQUF3QyxTQUF4QyxFQUQwQzs7QUFHMUMsUUFBSyxLQUFLLFNBQUwsSUFBa0IseUJBQVMsS0FBSyxTQUFMLENBQTNCLEVBQThDO0FBQ2pELFdBQUssU0FBTCxHQUFpQix1QkFBTyxhQUFQLEVBQXNCLEtBQUssU0FBTCxDQUF2QyxDQURpRDtLQUFuRCxNQUVPO0FBQ0wsV0FBSyxTQUFMLEdBQWlCLGFBQWpCLENBREs7S0FGUDtHQUhVOzs7QUFXWixTQUFPLGVBQVUsT0FBVixFQUFvQjtBQUN6QixXQUFPLGdCQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBNEIsSUFBNUIsRUFBa0Msd0JBQVEsRUFBUixFQUFZLE9BQVosRUFBcUI7QUFDNUQsYUFBTyxJQUFQO0tBRHVDLENBQWxDLENBQVAsQ0FEeUI7R0FBcEI7Ozs7QUFRUCxPQUFLLGFBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsT0FBcEIsRUFBOEI7OztBQUdqQyxRQUFLLE9BQU8sSUFBUCxFQUFjLE9BQU8sSUFBUCxDQUFuQjs7QUFFQSxRQUFJLGlCQUFKLENBTGlDO0FBTWpDLFFBQUssUUFBTyxpREFBUCxLQUFlLFFBQWYsRUFBMEI7QUFDN0IsY0FBUSxHQUFSLENBRDZCO0FBRTdCLGdCQUFVLEdBQVYsQ0FGNkI7S0FBL0IsTUFHTztBQUNMLE9BQUUsUUFBUSxFQUFSLENBQUYsQ0FBZ0IsR0FBaEIsSUFBd0IsR0FBeEIsQ0FESztLQUhQOztBQU9BLGdCQUFhLFVBQVUsRUFBVixDQUFiLENBYmlDOztBQWVqQyxRQUFLLENBQUMsUUFBUSxLQUFSLEVBQWdCOztBQUVwQixVQUFNLFVBQVUsOEJBQWMsc0JBQU0sS0FBTixDQUFkLEVBQTZCLEtBQUssU0FBTCxDQUF2Qzs7O0FBRmMsV0FLcEIsR0FBUSxzQkFBTSxLQUFOLEVBQWEsS0FBSyxTQUFMLENBQXJCLENBTG9COztBQU9wQixVQUFLLFFBQVEsTUFBUixHQUFpQixDQUFqQixFQUFxQjtBQUN4QixjQUFNLElBQUksS0FBSixDQUFXLDZDQUNmLFFBQVEsUUFBUixFQURlLENBQWpCLENBRHdCO09BQTFCO0tBUEY7O0FBYUEsV0FBTyxnQkFBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLElBQXBCLENBQTBCLElBQTFCLEVBQWdDLEtBQWhDLEVBQXVDLE9BQXZDLENBQVAsQ0E1QmlDO0dBQTlCO0NBdkJtQixDQUFiOzs7OztBQTBETixJQUFNLDRDQUFrQixxQkFBVyxNQUFYLENBQW1COzs7QUFHaEQsU0FBTyxlQUFVLE9BQVYsRUFBb0I7QUFDekIsV0FBTyxxQkFBVyxTQUFYLENBQXFCLEtBQXJCLENBQTJCLElBQTNCLENBQWlDLElBQWpDLEVBQXVDLHdCQUFRLEVBQVIsRUFBWSxPQUFaLEVBQXFCO0FBQ2pFLGFBQU8sSUFBUDtLQUQ0QyxDQUF2QyxDQUFQLENBRHlCO0dBQXBCO0NBSHNCLENBQWxCIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE1vZGVsLCBDb2xsZWN0aW9uIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHsgb21pdCwgdW5pb24sIGlzQXJyYXksIGludGVyc2VjdGlvbiwga2V5cywgZXh0ZW5kIH0gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8vIFNwZWNpYWwga2V5cyB0aGF0IGFyZSByZXNlcnZlZCBieSBzZXJpYWxpemVkIENvdWNoREIgZG9jdW1lbnRzXG5jb25zdCBiYXNlU2FmZWd1YXJkID0gWyAnX2lkJywgJ19yZXYnIF07XG5cbi8vICMjIENvdWNoIE1vZGVsXG4vLyBUaGlzIGJhc2UgY2xhc3MgZW5zdXJlcyB0aGUgY2xpZW50IHdpbGwgbm90IHVua25vd2luZ2x5IG1vZGlmeSB0aGUgc3BlY2lhbFxuLy8ga2V5cyBvZiBhIENvdWNoREIgZG9jdW1lbnQuXG5leHBvcnQgY29uc3QgQ291Y2hNb2RlbCA9IE1vZGVsLmV4dGVuZCgge1xuXG4gIC8vIEJ5IGRlZmF1bHQsIGBDb3VjaE1vZGVsYCBzYWZlZ3VhcmRzIGBfaWRgIGFuZCBgX3JldmAuIFlvdSBjYW4gZXh0ZW5kXG4gIC8vIHRoaXMgbGlzdCBvZiBzYWZlZ3VhcmRlZCBrZXlzIGJ5IHBhc3NpbmcgYW4gYXJyYXkgaW4gYG9wdGlvbnMuc3BlY2lhbGAuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgIE1vZGVsLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgIGlmICggdGhpcy5zYWZlZ3VhcmQgJiYgaXNBcnJheSggdGhpcy5zYWZlZ3VhcmQgKSApIHtcbiAgICAgIHRoaXMuc2FmZWd1YXJkID0gdW5pb24oIGJhc2VTYWZlZ3VhcmQsIHRoaXMuc2FmZWd1YXJkICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2FmZWd1YXJkID0gYmFzZVNhZmVndWFyZDtcbiAgICB9XG4gIH0sXG5cbiAgLy8gV2hlbiBmZXRjaGluZyBhIHNpbmdsZSBkb2N1bWVudCwgYWxsb3cgb3ZlcnJpZGluZyBzYWZlZ3VhcmRlZCBDb3VjaCBrZXlzXG4gIGZldGNoOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcbiAgICByZXR1cm4gTW9kZWwucHJvdG90eXBlLmZldGNoLmNhbGwoIHRoaXMsIGV4dGVuZCgge30sIG9wdGlvbnMsIHtcbiAgICAgIGZvcmNlOiB0cnVlXG4gICAgfSApICk7XG4gIH0sXG5cbiAgLy8gT3ZlcnJpZGUgQmFja2JvbmUncyBzZXQgZnVuY3Rpb24gdG8gaWdub3JlIGFsbCB0aGUgc3BlY2lhbCBrZXlzLCAqdW5sZXNzXG4gIC8vIG91ciBjdXN0b20gZm9yY2Ugb3B0aW9uIGlzIHNldCB0byB0cnVlKi5cbiAgc2V0OiBmdW5jdGlvbigga2V5LCB2YWwsIG9wdGlvbnMgKSB7XG5cbiAgICAvLyBXZSByZXVzZSBCYWNrYm9uZSdzIGFyZ3VtZW50IG5vcm1hbGl6YXRpb24gY29kZVxuICAgIGlmICgga2V5ID09IG51bGwgKSByZXR1cm4gdGhpcztcblxuICAgIGxldCBhdHRycztcbiAgICBpZiAoIHR5cGVvZiBrZXkgPT09ICdvYmplY3QnICkge1xuICAgICAgYXR0cnMgPSBrZXk7XG4gICAgICBvcHRpb25zID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAoIGF0dHJzID0ge30gKVsga2V5IF0gPSB2YWw7XG4gICAgfVxuXG4gICAgb3B0aW9ucyB8fCAoIG9wdGlvbnMgPSB7fSApO1xuXG4gICAgaWYgKCAhb3B0aW9ucy5mb3JjZSApIHtcbiAgICAgIC8vIFVuY29tbWVudCB0byBsb2cga2V5cyB0aGF0IHdlIG9taXQgZnJvbSBzdXBlci5zZXQoKVxuICAgICAgY29uc3Qgb21pdHRlZCA9IGludGVyc2VjdGlvbigga2V5cyggYXR0cnMgKSwgdGhpcy5zYWZlZ3VhcmQgKTtcblxuICAgICAgLy8gQWN0dWFsbHkgb21pdCBzYWZlZ3VhcmRlZCBrZXlzXG4gICAgICBhdHRycyA9IG9taXQoIGF0dHJzLCB0aGlzLnNhZmVndWFyZCApO1xuXG4gICAgICBpZiAoIG9taXR0ZWQubGVuZ3RoID4gMCApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnYXR0ZW1wdGVkIG92ZXJyaWRlIG9mIHNhZmVndWFyZGVkIGtleXM6ICcgK1xuICAgICAgICAgIG9taXR0ZWQudG9TdHJpbmcoKSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBNb2RlbC5wcm90b3R5cGUuc2V0LmNhbGwoIHRoaXMsIGF0dHJzLCBvcHRpb25zICk7XG4gIH1cbn0gKTtcblxuLy8gIyMgQ291Y2ggQ29sbGVjdGlvblxuLy8gVGhpcyBiYXNlIGNvbGxlY3Rpb24gY2xhc3MgaGVscHMgdGhlIENvdWNoTW9kZWwgdG8gcHJldmVudCB0aGUgY2xpZW50XG4vLyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZyB0aGUgc3BlY2lhbCBrZXlzIG9mIGEgQ291Y2hEQiBkb2N1bWVudC5cbmV4cG9ydCBjb25zdCBDb3VjaENvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCgge1xuXG4gIC8vIFdoZW4gZmV0Y2hpbmcgbXVsdGlwbGUgZG9jdW1lbnRzLCBhbGxvdyBvdmVycmlkaW5nIHNhZmVndWFyZGVkIENvdWNoIGtleXNcbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHJldHVybiBDb2xsZWN0aW9uLnByb3RvdHlwZS5mZXRjaC5jYWxsKCB0aGlzLCBleHRlbmQoIHt9LCBvcHRpb25zLCB7XG4gICAgICBmb3JjZTogdHJ1ZVxuICAgIH0gKSApO1xuICB9XG59ICk7XG4iXX0=
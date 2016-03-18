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

    // if ( !options.force ) {
    //   // Uncomment to log keys that we omit from super.set()
    //   const omitted = intersection( keys( attrs ), this.safeguard );
    //
    //   // Actually omit safeguarded keys
    //   attrs = omit( attrs, this.safeguard );
    //
    //   if ( omitted.length > 0 ) {
    //     throw new Error( 'attempted override of safeguarded keys: ' +
    //       omitted.toString() );
    //   }
    // }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQXdCZ0IsV0FBVyxHQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFwQixTQUFTLFdBQVcsQ0FBRSxJQUFJLEVBQUc7QUFDbEMsU0FBTztBQUNMLFlBQVEsRUFBRSxJQUFJO0FBQ2QsVUFBTSxFQUFFLElBQUksR0FBRyxHQUFRO0dBQ3hCLENBQUM7Q0FDSDs7O0FBQUEsQUFHRCxJQUFNLGFBQWEsR0FBRyxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUU7Ozs7O0FBQUMsQUFLakMsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLGdCQUFNLE1BQU0sQ0FBRTs7OztBQUl0QyxZQUFVLEVBQUUsb0JBQVUsVUFBVSxFQUFFLE9BQU8sRUFBRztBQUMxQyxvQkFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFFLENBQUM7O0FBRXBELFFBQUssSUFBSSxDQUFDLFNBQVMsSUFBSSx5QkFBUyxJQUFJLENBQUMsU0FBUyxDQUFFLEVBQUc7QUFDakQsVUFBSSxDQUFDLFNBQVMsR0FBRyx1QkFBTyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO0tBQ3pELE1BQU07QUFDTCxVQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztLQUNoQztHQUNGOzs7QUFHRCxPQUFLLEVBQUUsZUFBVSxPQUFPLEVBQUc7QUFDekIsV0FBTyxnQkFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLEVBQUUsd0JBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUM1RCxXQUFLLEVBQUUsSUFBSTtLQUNaLENBQUUsQ0FBRSxDQUFDO0dBQ1A7Ozs7QUFJRCxLQUFHLEVBQUUsYUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRzs7O0FBR2pDLFFBQUssR0FBRyxJQUFJLElBQUksRUFBRyxPQUFPLElBQUksQ0FBQzs7QUFFL0IsUUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFFBQUssUUFBTyxHQUFHLHlDQUFILEdBQUcsT0FBSyxRQUFRLEVBQUc7QUFDN0IsV0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNaLGFBQU8sR0FBRyxHQUFHLENBQUM7S0FDZixNQUFNO0FBQ0wsT0FBRSxLQUFLLEdBQUcsRUFBRSxDQUFBLENBQUksR0FBRyxDQUFFLEdBQUcsR0FBRyxDQUFDO0tBQzdCOztBQUVELFdBQU8sS0FBTSxPQUFPLEdBQUcsRUFBRSxDQUFBLEFBQUU7Ozs7Ozs7Ozs7Ozs7OztBQUFDLEFBZTVCLFdBQU8sZ0JBQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUUsQ0FBQztHQUN6RDtDQUNGLENBQUU7Ozs7O0FBQUMsQUFLRyxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcscUJBQVcsTUFBTSxDQUFFOzs7QUFHaEQsT0FBSyxFQUFFLGVBQVUsT0FBTyxFQUFHO0FBQ3pCLFdBQU8scUJBQVcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxFQUFFLHdCQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDakUsV0FBSyxFQUFFLElBQUk7S0FDWixDQUFFLENBQUUsQ0FBQztHQUNQOztBQUVELE9BQUssRUFBRSxlQUFVLFFBQVEsRUFBRSxPQUFPLEVBQUc7QUFDbkMsV0FBTyxpQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBRSxDQUFDO0dBQ3BDO0NBQ0YsQ0FBRSxDQUFDIiwiZmlsZSI6ImJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IE1vZGVsLCBDb2xsZWN0aW9uIH0gZnJvbSAnYmFja2JvbmUnO1xuaW1wb3J0IHsgb21pdCwgdW5pb24sIGlzQXJyYXksIGludGVyc2VjdGlvbiwga2V5cywgZXh0ZW5kIH0gZnJvbSAndW5kZXJzY29yZSc7XG5cbmltcG9ydCB7IG1hcCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlzQmV0d2VlbiggYmFzZSApIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydGtleTogYmFzZSxcbiAgICBlbmRrZXk6IGJhc2UgKyAnXFx1ZmZmZidcbiAgfTtcbn1cblxuLy8gU3BlY2lhbCBrZXlzIHRoYXQgYXJlIHJlc2VydmVkIGJ5IHNlcmlhbGl6ZWQgQ291Y2hEQiBkb2N1bWVudHNcbmNvbnN0IGJhc2VTYWZlZ3VhcmQgPSBbICdfaWQnLCAnX3JldicgXTtcblxuLy8gIyMgQ291Y2ggTW9kZWxcbi8vIFRoaXMgYmFzZSBjbGFzcyBlbnN1cmVzIHRoZSBjbGllbnQgd2lsbCBub3QgdW5rbm93aW5nbHkgbW9kaWZ5IHRoZSBzcGVjaWFsXG4vLyBrZXlzIG9mIGEgQ291Y2hEQiBkb2N1bWVudC5cbmV4cG9ydCBjb25zdCBDb3VjaE1vZGVsID0gTW9kZWwuZXh0ZW5kKCB7XG5cbiAgLy8gQnkgZGVmYXVsdCwgYENvdWNoTW9kZWxgIHNhZmVndWFyZHMgYF9pZGAgYW5kIGBfcmV2YC4gWW91IGNhbiBleHRlbmRcbiAgLy8gdGhpcyBsaXN0IG9mIHNhZmVndWFyZGVkIGtleXMgYnkgcGFzc2luZyBhbiBhcnJheSBpbiBgb3B0aW9ucy5zcGVjaWFsYC5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgTW9kZWwucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG4gICAgaWYgKCB0aGlzLnNhZmVndWFyZCAmJiBpc0FycmF5KCB0aGlzLnNhZmVndWFyZCApICkge1xuICAgICAgdGhpcy5zYWZlZ3VhcmQgPSB1bmlvbiggYmFzZVNhZmVndWFyZCwgdGhpcy5zYWZlZ3VhcmQgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zYWZlZ3VhcmQgPSBiYXNlU2FmZWd1YXJkO1xuICAgIH1cbiAgfSxcblxuICAvLyBXaGVuIGZldGNoaW5nIGEgc2luZ2xlIGRvY3VtZW50LCBhbGxvdyBvdmVycmlkaW5nIHNhZmVndWFyZGVkIENvdWNoIGtleXNcbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHJldHVybiBNb2RlbC5wcm90b3R5cGUuZmV0Y2guY2FsbCggdGhpcywgZXh0ZW5kKCB7fSwgb3B0aW9ucywge1xuICAgICAgZm9yY2U6IHRydWVcbiAgICB9ICkgKTtcbiAgfSxcblxuICAvLyBPdmVycmlkZSBCYWNrYm9uZSdzIHNldCBmdW5jdGlvbiB0byBpZ25vcmUgYWxsIHRoZSBzcGVjaWFsIGtleXMsICp1bmxlc3NcbiAgLy8gb3VyIGN1c3RvbSBmb3JjZSBvcHRpb24gaXMgc2V0IHRvIHRydWUqLlxuICBzZXQ6IGZ1bmN0aW9uKCBrZXksIHZhbCwgb3B0aW9ucyApIHtcblxuICAgIC8vIFdlIHJldXNlIEJhY2tib25lJ3MgYXJndW1lbnQgbm9ybWFsaXphdGlvbiBjb2RlXG4gICAgaWYgKCBrZXkgPT0gbnVsbCApIHJldHVybiB0aGlzO1xuXG4gICAgbGV0IGF0dHJzO1xuICAgIGlmICggdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgKSB7XG4gICAgICBhdHRycyA9IGtleTtcbiAgICAgIG9wdGlvbnMgPSB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgICggYXR0cnMgPSB7fSApWyBrZXkgXSA9IHZhbDtcbiAgICB9XG5cbiAgICBvcHRpb25zIHx8ICggb3B0aW9ucyA9IHt9ICk7XG5cbiAgICAvLyBpZiAoICFvcHRpb25zLmZvcmNlICkge1xuICAgIC8vICAgLy8gVW5jb21tZW50IHRvIGxvZyBrZXlzIHRoYXQgd2Ugb21pdCBmcm9tIHN1cGVyLnNldCgpXG4gICAgLy8gICBjb25zdCBvbWl0dGVkID0gaW50ZXJzZWN0aW9uKCBrZXlzKCBhdHRycyApLCB0aGlzLnNhZmVndWFyZCApO1xuICAgIC8vXG4gICAgLy8gICAvLyBBY3R1YWxseSBvbWl0IHNhZmVndWFyZGVkIGtleXNcbiAgICAvLyAgIGF0dHJzID0gb21pdCggYXR0cnMsIHRoaXMuc2FmZWd1YXJkICk7XG4gICAgLy8gXG4gICAgLy8gICBpZiAoIG9taXR0ZWQubGVuZ3RoID4gMCApIHtcbiAgICAvLyAgICAgdGhyb3cgbmV3IEVycm9yKCAnYXR0ZW1wdGVkIG92ZXJyaWRlIG9mIHNhZmVndWFyZGVkIGtleXM6ICcgK1xuICAgIC8vICAgICAgIG9taXR0ZWQudG9TdHJpbmcoKSApO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIHJldHVybiBNb2RlbC5wcm90b3R5cGUuc2V0LmNhbGwoIHRoaXMsIGF0dHJzLCBvcHRpb25zICk7XG4gIH1cbn0gKTtcblxuLy8gIyMgQ291Y2ggQ29sbGVjdGlvblxuLy8gVGhpcyBiYXNlIGNvbGxlY3Rpb24gY2xhc3MgaGVscHMgdGhlIENvdWNoTW9kZWwgdG8gcHJldmVudCB0aGUgY2xpZW50XG4vLyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZyB0aGUgc3BlY2lhbCBrZXlzIG9mIGEgQ291Y2hEQiBkb2N1bWVudC5cbmV4cG9ydCBjb25zdCBDb3VjaENvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCgge1xuXG4gIC8vIFdoZW4gZmV0Y2hpbmcgbXVsdGlwbGUgZG9jdW1lbnRzLCBhbGxvdyBvdmVycmlkaW5nIHNhZmVndWFyZGVkIENvdWNoIGtleXNcbiAgZmV0Y2g6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHJldHVybiBDb2xsZWN0aW9uLnByb3RvdHlwZS5mZXRjaC5jYWxsKCB0aGlzLCBleHRlbmQoIHt9LCBvcHRpb25zLCB7XG4gICAgICBmb3JjZTogdHJ1ZVxuICAgIH0gKSApO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbiggcmVzcG9uc2UsIG9wdGlvbnMgKSB7XG4gICAgcmV0dXJuIG1hcCggcmVzcG9uc2Uucm93cywgJ2RvYycgKTtcbiAgfVxufSApO1xuIl19
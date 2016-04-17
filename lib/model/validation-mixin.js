'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ValidationMixin;
exports.mixinValidation = mixinValidation;
exports.mergeSchemas = mergeSchemas;

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// # Validation Mixin Factory
// A function to generate a mixin that may be applied to a backbone model.
// To generate the mixin, you must supply a conformant JSON schema as JSON.
//
// We are using [ajv](https://github.com/epoberezkin/ajv) to validate models.
// Some notable configuration pieces:
//  - allErrors: report all errors encountered instead of failing fast
//  - useDefaults: if a default is provided, inject that into the model
//
// The ajv instance will be closed over by the `validate` function mixed into
// the backbone model.
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

function ValidationMixin(schema) {
  var ajv = (0, _ajv2.default)({
    removeAdditional: true,
    allErrors: true,
    useDefaults: true
  });

  return {
    // ## Validate
    // Validate model attributes with ajv. Exclude safeguarded keys before
    // validation (see CouchModel). Returns either an array of errors or
    // undefined.
    validate: function validate(attributes, options) {
      var attrs = void 0;
      if (this.safeguard) {
        attrs = (0, _lodash.omit)(attributes, this.safeguard);
      } else {
        attrs = attributes;
      }

      var valid = ajv.validate(schema, attrs);
      if (!valid) {
        return ajv.errors;
      }
    }
  };
}

// # mixinValidation
// Given a backbone model or collection, mix in the validation function,
// prepared for a JSON schema. This schema must be available as JSON
// in the model or collection's prototype.
function mixinValidation(modelWithSchema) {
  var mixin = ValidationMixin(modelWithSchema.prototype.schema);
  (0, _lodash.assign)(modelWithSchema.prototype, mixin);
}

// # mergeSchemas
// In ineritance hierarchies, JSON schemas must be merged.
// This function merges schema JSON just like lodash.merge, except we union
// arrays together (for use with the `required` field for instance).
function mergeSchemas(parent, mine) {
  var intermediate = (0, _lodash.merge)({}, parent, mine);
  var required = (0, _lodash.union)(parent.required, mine.required);

  return (0, _lodash.assign)({}, intermediate, { required: required });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlDd0I7UUFnQ1I7UUFTQTs7QUF2RGhCOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhZSxTQUFTLGVBQVQsQ0FBMEIsTUFBMUIsRUFBbUM7QUFDaEQsTUFBTSxNQUFNLG1CQUFLO0FBQ2Ysc0JBQWtCLElBQWxCO0FBQ0EsZUFBVyxJQUFYO0FBQ0EsaUJBQWEsSUFBYjtHQUhVLENBQU4sQ0FEMEM7O0FBT2hELFNBQU87Ozs7O0FBS0wsY0FBVSxrQkFBVSxVQUFWLEVBQXNCLE9BQXRCLEVBQWdDO0FBQ3hDLFVBQUksY0FBSixDQUR3QztBQUV4QyxVQUFLLEtBQUssU0FBTCxFQUFpQjtBQUNwQixnQkFBUSxrQkFBTSxVQUFOLEVBQWtCLEtBQUssU0FBTCxDQUExQixDQURvQjtPQUF0QixNQUVPO0FBQ0wsZ0JBQVEsVUFBUixDQURLO09BRlA7O0FBTUEsVUFBTSxRQUFRLElBQUksUUFBSixDQUFjLE1BQWQsRUFBc0IsS0FBdEIsQ0FBUixDQVJrQztBQVN4QyxVQUFLLENBQUMsS0FBRCxFQUFTO0FBQ1osZUFBTyxJQUFJLE1BQUosQ0FESztPQUFkO0tBVFE7R0FMWixDQVBnRDtDQUFuQzs7Ozs7O0FBZ0NSLFNBQVMsZUFBVCxDQUEwQixlQUExQixFQUE0QztBQUNqRCxNQUFNLFFBQVEsZ0JBQWlCLGdCQUFnQixTQUFoQixDQUEwQixNQUExQixDQUF6QixDQUQyQztBQUVqRCxzQkFBUSxnQkFBZ0IsU0FBaEIsRUFBMkIsS0FBbkMsRUFGaUQ7Q0FBNUM7Ozs7OztBQVNBLFNBQVMsWUFBVCxDQUF1QixNQUF2QixFQUErQixJQUEvQixFQUFzQztBQUMzQyxNQUFNLGVBQWUsbUJBQU8sRUFBUCxFQUFXLE1BQVgsRUFBbUIsSUFBbkIsQ0FBZixDQURxQztBQUUzQyxNQUFNLFdBQVcsbUJBQU8sT0FBTyxRQUFQLEVBQWlCLEtBQUssUUFBTCxDQUFuQyxDQUZxQzs7QUFJM0MsU0FBTyxvQkFBUSxFQUFSLEVBQVksWUFBWixFQUEwQixFQUFFLGtCQUFGLEVBQTFCLENBQVAsQ0FKMkM7Q0FBdEMiLCJmaWxlIjoidmFsaWRhdGlvbi1taXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cclxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cclxuICpcclxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XHJcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXHJcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXHJcbiAqXHJcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXHJcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcclxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXHJcbiAqXHJcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxyXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cclxuICovXHJcblxyXG5pbXBvcnQgQWp2IGZyb20gJ2Fqdic7XHJcbmltcG9ydCB7IGFzc2lnbiwgb21pdCwgbWVyZ2UsIHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vICMgVmFsaWRhdGlvbiBNaXhpbiBGYWN0b3J5XHJcbi8vIEEgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBtaXhpbiB0aGF0IG1heSBiZSBhcHBsaWVkIHRvIGEgYmFja2JvbmUgbW9kZWwuXHJcbi8vIFRvIGdlbmVyYXRlIHRoZSBtaXhpbiwgeW91IG11c3Qgc3VwcGx5IGEgY29uZm9ybWFudCBKU09OIHNjaGVtYSBhcyBKU09OLlxyXG4vL1xyXG4vLyBXZSBhcmUgdXNpbmcgW2Fqdl0oaHR0cHM6Ly9naXRodWIuY29tL2Vwb2JlcmV6a2luL2FqdikgdG8gdmFsaWRhdGUgbW9kZWxzLlxyXG4vLyBTb21lIG5vdGFibGUgY29uZmlndXJhdGlvbiBwaWVjZXM6XHJcbi8vICAtIGFsbEVycm9yczogcmVwb3J0IGFsbCBlcnJvcnMgZW5jb3VudGVyZWQgaW5zdGVhZCBvZiBmYWlsaW5nIGZhc3RcclxuLy8gIC0gdXNlRGVmYXVsdHM6IGlmIGEgZGVmYXVsdCBpcyBwcm92aWRlZCwgaW5qZWN0IHRoYXQgaW50byB0aGUgbW9kZWxcclxuLy9cclxuLy8gVGhlIGFqdiBpbnN0YW5jZSB3aWxsIGJlIGNsb3NlZCBvdmVyIGJ5IHRoZSBgdmFsaWRhdGVgIGZ1bmN0aW9uIG1peGVkIGludG9cclxuLy8gdGhlIGJhY2tib25lIG1vZGVsLlxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBWYWxpZGF0aW9uTWl4aW4oIHNjaGVtYSApIHtcclxuICBjb25zdCBhanYgPSBBanYoIHtcclxuICAgIHJlbW92ZUFkZGl0aW9uYWw6IHRydWUsXHJcbiAgICBhbGxFcnJvcnM6IHRydWUsXHJcbiAgICB1c2VEZWZhdWx0czogdHJ1ZVxyXG4gIH0gKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC8vICMjIFZhbGlkYXRlXHJcbiAgICAvLyBWYWxpZGF0ZSBtb2RlbCBhdHRyaWJ1dGVzIHdpdGggYWp2LiBFeGNsdWRlIHNhZmVndWFyZGVkIGtleXMgYmVmb3JlXHJcbiAgICAvLyB2YWxpZGF0aW9uIChzZWUgQ291Y2hNb2RlbCkuIFJldHVybnMgZWl0aGVyIGFuIGFycmF5IG9mIGVycm9ycyBvclxyXG4gICAgLy8gdW5kZWZpbmVkLlxyXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xyXG4gICAgICBsZXQgYXR0cnM7XHJcbiAgICAgIGlmICggdGhpcy5zYWZlZ3VhcmQgKSB7XHJcbiAgICAgICAgYXR0cnMgPSBvbWl0KCBhdHRyaWJ1dGVzLCB0aGlzLnNhZmVndWFyZCApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF0dHJzID0gYXR0cmlidXRlcztcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdmFsaWQgPSBhanYudmFsaWRhdGUoIHNjaGVtYSwgYXR0cnMgKTtcclxuICAgICAgaWYgKCAhdmFsaWQgKSB7XHJcbiAgICAgICAgcmV0dXJuIGFqdi5lcnJvcnM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyAjIG1peGluVmFsaWRhdGlvblxyXG4vLyBHaXZlbiBhIGJhY2tib25lIG1vZGVsIG9yIGNvbGxlY3Rpb24sIG1peCBpbiB0aGUgdmFsaWRhdGlvbiBmdW5jdGlvbixcclxuLy8gcHJlcGFyZWQgZm9yIGEgSlNPTiBzY2hlbWEuIFRoaXMgc2NoZW1hIG11c3QgYmUgYXZhaWxhYmxlIGFzIEpTT05cclxuLy8gaW4gdGhlIG1vZGVsIG9yIGNvbGxlY3Rpb24ncyBwcm90b3R5cGUuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXhpblZhbGlkYXRpb24oIG1vZGVsV2l0aFNjaGVtYSApIHtcclxuICBjb25zdCBtaXhpbiA9IFZhbGlkYXRpb25NaXhpbiggbW9kZWxXaXRoU2NoZW1hLnByb3RvdHlwZS5zY2hlbWEgKTtcclxuICBhc3NpZ24oIG1vZGVsV2l0aFNjaGVtYS5wcm90b3R5cGUsIG1peGluICk7XHJcbn1cclxuXHJcbi8vICMgbWVyZ2VTY2hlbWFzXHJcbi8vIEluIGluZXJpdGFuY2UgaGllcmFyY2hpZXMsIEpTT04gc2NoZW1hcyBtdXN0IGJlIG1lcmdlZC5cclxuLy8gVGhpcyBmdW5jdGlvbiBtZXJnZXMgc2NoZW1hIEpTT04ganVzdCBsaWtlIGxvZGFzaC5tZXJnZSwgZXhjZXB0IHdlIHVuaW9uXHJcbi8vIGFycmF5cyB0b2dldGhlciAoZm9yIHVzZSB3aXRoIHRoZSBgcmVxdWlyZWRgIGZpZWxkIGZvciBpbnN0YW5jZSkuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVNjaGVtYXMoIHBhcmVudCwgbWluZSApIHtcclxuICBjb25zdCBpbnRlcm1lZGlhdGUgPSBtZXJnZSgge30sIHBhcmVudCwgbWluZSApO1xyXG4gIGNvbnN0IHJlcXVpcmVkID0gdW5pb24oIHBhcmVudC5yZXF1aXJlZCwgbWluZS5yZXF1aXJlZCApO1xyXG5cclxuICByZXR1cm4gYXNzaWduKCB7fSwgaW50ZXJtZWRpYXRlLCB7IHJlcXVpcmVkIH0gKTtcclxufVxyXG4iXX0=
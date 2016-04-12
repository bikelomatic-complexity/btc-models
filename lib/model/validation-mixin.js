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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlDd0I7UUFnQ1I7UUFTQTs7QUF2RGhCOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhZSxTQUFTLGVBQVQsQ0FBMEIsTUFBMUIsRUFBbUM7QUFDaEQsTUFBTSxNQUFNLG1CQUFLO0FBQ2Ysc0JBQWtCLElBQWxCO0FBQ0EsZUFBVyxJQUFYO0FBQ0EsaUJBQWEsSUFBYjtHQUhVLENBQU4sQ0FEMEM7O0FBT2hELFNBQU87Ozs7O0FBS0wsY0FBVSxrQkFBVSxVQUFWLEVBQXNCLE9BQXRCLEVBQWdDO0FBQ3hDLFVBQUksY0FBSixDQUR3QztBQUV4QyxVQUFLLEtBQUssU0FBTCxFQUFpQjtBQUNwQixnQkFBUSxrQkFBTSxVQUFOLEVBQWtCLEtBQUssU0FBTCxDQUExQixDQURvQjtPQUF0QixNQUVPO0FBQ0wsZ0JBQVEsVUFBUixDQURLO09BRlA7O0FBTUEsVUFBTSxRQUFRLElBQUksUUFBSixDQUFjLE1BQWQsRUFBc0IsS0FBdEIsQ0FBUixDQVJrQztBQVN4QyxVQUFLLENBQUMsS0FBRCxFQUFTO0FBQ1osZUFBTyxJQUFJLE1BQUosQ0FESztPQUFkO0tBVFE7R0FMWixDQVBnRDtDQUFuQzs7Ozs7O0FBZ0NSLFNBQVMsZUFBVCxDQUEwQixlQUExQixFQUE0QztBQUNqRCxNQUFNLFFBQVEsZ0JBQWlCLGdCQUFnQixTQUFoQixDQUEwQixNQUExQixDQUF6QixDQUQyQztBQUVqRCxzQkFBUSxnQkFBZ0IsU0FBaEIsRUFBMkIsS0FBbkMsRUFGaUQ7Q0FBNUM7Ozs7OztBQVNBLFNBQVMsWUFBVCxDQUF1QixNQUF2QixFQUErQixJQUEvQixFQUFzQztBQUMzQyxNQUFNLGVBQWUsbUJBQU8sRUFBUCxFQUFXLE1BQVgsRUFBbUIsSUFBbkIsQ0FBZixDQURxQztBQUUzQyxNQUFNLFdBQVcsbUJBQU8sT0FBTyxRQUFQLEVBQWlCLEtBQUssUUFBTCxDQUFuQyxDQUZxQzs7QUFJM0MsU0FBTyxvQkFBUSxFQUFSLEVBQVksWUFBWixFQUEwQixFQUFFLGtCQUFGLEVBQTFCLENBQVAsQ0FKMkM7Q0FBdEMiLCJmaWxlIjoidmFsaWRhdGlvbi1taXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGJ0Yy1hcHAtc2VydmVyIC0tIFNlcnZlciBmb3IgdGhlIEJpY3ljbGUgVG91cmluZyBDb21wYW5pb25cbiAqIENvcHlyaWdodCDCqSAyMDE2IEFkdmVudHVyZSBDeWNsaW5nIEFzc29jaWF0aW9uXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgYnRjLWFwcC1zZXJ2ZXIuXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBGb29iYXIuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IEFqdiBmcm9tICdhanYnO1xuaW1wb3J0IHsgYXNzaWduLCBvbWl0LCBtZXJnZSwgdW5pb24gfSBmcm9tICdsb2Rhc2gnO1xuXG4vLyAjIFZhbGlkYXRpb24gTWl4aW4gRmFjdG9yeVxuLy8gQSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIG1peGluIHRoYXQgbWF5IGJlIGFwcGxpZWQgdG8gYSBiYWNrYm9uZSBtb2RlbC5cbi8vIFRvIGdlbmVyYXRlIHRoZSBtaXhpbiwgeW91IG11c3Qgc3VwcGx5IGEgY29uZm9ybWFudCBKU09OIHNjaGVtYSBhcyBKU09OLlxuLy9cbi8vIFdlIGFyZSB1c2luZyBbYWp2XShodHRwczovL2dpdGh1Yi5jb20vZXBvYmVyZXpraW4vYWp2KSB0byB2YWxpZGF0ZSBtb2RlbHMuXG4vLyBTb21lIG5vdGFibGUgY29uZmlndXJhdGlvbiBwaWVjZXM6XG4vLyAgLSBhbGxFcnJvcnM6IHJlcG9ydCBhbGwgZXJyb3JzIGVuY291bnRlcmVkIGluc3RlYWQgb2YgZmFpbGluZyBmYXN0XG4vLyAgLSB1c2VEZWZhdWx0czogaWYgYSBkZWZhdWx0IGlzIHByb3ZpZGVkLCBpbmplY3QgdGhhdCBpbnRvIHRoZSBtb2RlbFxuLy9cbi8vIFRoZSBhanYgaW5zdGFuY2Ugd2lsbCBiZSBjbG9zZWQgb3ZlciBieSB0aGUgYHZhbGlkYXRlYCBmdW5jdGlvbiBtaXhlZCBpbnRvXG4vLyB0aGUgYmFja2JvbmUgbW9kZWwuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBWYWxpZGF0aW9uTWl4aW4oIHNjaGVtYSApIHtcbiAgY29uc3QgYWp2ID0gQWp2KCB7XG4gICAgcmVtb3ZlQWRkaXRpb25hbDogdHJ1ZSxcbiAgICBhbGxFcnJvcnM6IHRydWUsXG4gICAgdXNlRGVmYXVsdHM6IHRydWVcbiAgfSApO1xuXG4gIHJldHVybiB7XG4gICAgLy8gIyMgVmFsaWRhdGVcbiAgICAvLyBWYWxpZGF0ZSBtb2RlbCBhdHRyaWJ1dGVzIHdpdGggYWp2LiBFeGNsdWRlIHNhZmVndWFyZGVkIGtleXMgYmVmb3JlXG4gICAgLy8gdmFsaWRhdGlvbiAoc2VlIENvdWNoTW9kZWwpLiBSZXR1cm5zIGVpdGhlciBhbiBhcnJheSBvZiBlcnJvcnMgb3JcbiAgICAvLyB1bmRlZmluZWQuXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzLCBvcHRpb25zICkge1xuICAgICAgbGV0IGF0dHJzO1xuICAgICAgaWYgKCB0aGlzLnNhZmVndWFyZCApIHtcbiAgICAgICAgYXR0cnMgPSBvbWl0KCBhdHRyaWJ1dGVzLCB0aGlzLnNhZmVndWFyZCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnMgPSBhdHRyaWJ1dGVzO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2YWxpZCA9IGFqdi52YWxpZGF0ZSggc2NoZW1hLCBhdHRycyApO1xuICAgICAgaWYgKCAhdmFsaWQgKSB7XG4gICAgICAgIHJldHVybiBhanYuZXJyb3JzO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLy8gIyBtaXhpblZhbGlkYXRpb25cbi8vIEdpdmVuIGEgYmFja2JvbmUgbW9kZWwgb3IgY29sbGVjdGlvbiwgbWl4IGluIHRoZSB2YWxpZGF0aW9uIGZ1bmN0aW9uLFxuLy8gcHJlcGFyZWQgZm9yIGEgSlNPTiBzY2hlbWEuIFRoaXMgc2NoZW1hIG11c3QgYmUgYXZhaWxhYmxlIGFzIEpTT05cbi8vIGluIHRoZSBtb2RlbCBvciBjb2xsZWN0aW9uJ3MgcHJvdG90eXBlLlxuZXhwb3J0IGZ1bmN0aW9uIG1peGluVmFsaWRhdGlvbiggbW9kZWxXaXRoU2NoZW1hICkge1xuICBjb25zdCBtaXhpbiA9IFZhbGlkYXRpb25NaXhpbiggbW9kZWxXaXRoU2NoZW1hLnByb3RvdHlwZS5zY2hlbWEgKTtcbiAgYXNzaWduKCBtb2RlbFdpdGhTY2hlbWEucHJvdG90eXBlLCBtaXhpbiApO1xufVxuXG4vLyAjIG1lcmdlU2NoZW1hc1xuLy8gSW4gaW5lcml0YW5jZSBoaWVyYXJjaGllcywgSlNPTiBzY2hlbWFzIG11c3QgYmUgbWVyZ2VkLlxuLy8gVGhpcyBmdW5jdGlvbiBtZXJnZXMgc2NoZW1hIEpTT04ganVzdCBsaWtlIGxvZGFzaC5tZXJnZSwgZXhjZXB0IHdlIHVuaW9uXG4vLyBhcnJheXMgdG9nZXRoZXIgKGZvciB1c2Ugd2l0aCB0aGUgYHJlcXVpcmVkYCBmaWVsZCBmb3IgaW5zdGFuY2UpLlxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU2NoZW1hcyggcGFyZW50LCBtaW5lICkge1xuICBjb25zdCBpbnRlcm1lZGlhdGUgPSBtZXJnZSgge30sIHBhcmVudCwgbWluZSApO1xuICBjb25zdCByZXF1aXJlZCA9IHVuaW9uKCBwYXJlbnQucmVxdWlyZWQsIG1pbmUucmVxdWlyZWQgKTtcblxuICByZXR1cm4gYXNzaWduKCB7fSwgaW50ZXJtZWRpYXRlLCB7IHJlcXVpcmVkIH0gKTtcbn1cbiJdfQ==
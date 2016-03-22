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
      var attrs = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlDd0IsZUFBZTtRQWdDdkIsZUFBZSxHQUFmLGVBQWU7UUFTZixZQUFZLEdBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXpDYixTQUFTLGVBQWUsQ0FBRSxNQUFNLEVBQUc7QUFDaEQsTUFBTSxHQUFHLEdBQUcsbUJBQUs7QUFDZixvQkFBZ0IsRUFBRSxJQUFJO0FBQ3RCLGFBQVMsRUFBRSxJQUFJO0FBQ2YsZUFBVyxFQUFFLElBQUk7R0FDbEIsQ0FBRSxDQUFDOztBQUVKLFNBQU87Ozs7O0FBS0wsWUFBUSxFQUFFLGtCQUFVLFVBQVUsRUFBRSxPQUFPLEVBQUc7QUFDeEMsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFVBQUssSUFBSSxDQUFDLFNBQVMsRUFBRztBQUNwQixhQUFLLEdBQUcsa0JBQU0sVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztPQUM1QyxNQUFNO0FBQ0wsYUFBSyxHQUFHLFVBQVUsQ0FBQztPQUNwQjs7QUFFRCxVQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFFLE1BQU0sRUFBRSxLQUFLLENBQUUsQ0FBQztBQUM1QyxVQUFLLENBQUMsS0FBSyxFQUFHO0FBQ1osZUFBTyxHQUFHLENBQUMsTUFBTSxDQUFDO09BQ25CO0tBQ0Y7R0FDRixDQUFDO0NBQ0g7Ozs7OztBQUFBLEFBTU0sU0FBUyxlQUFlLENBQUUsZUFBZSxFQUFHO0FBQ2pELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBRSxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBRSxDQUFDO0FBQ2xFLHNCQUFRLGVBQWUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFFLENBQUM7Q0FDNUM7Ozs7OztBQUFBLEFBTU0sU0FBUyxZQUFZLENBQUUsTUFBTSxFQUFFLElBQUksRUFBRztBQUMzQyxNQUFNLFlBQVksR0FBRyxtQkFBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBRSxDQUFDO0FBQy9DLE1BQU0sUUFBUSxHQUFHLG1CQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDOztBQUV6RCxTQUFPLG9CQUFRLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUUsQ0FBQztDQUNqRCIsImZpbGUiOiJ2YWxpZGF0aW9uLW1peGluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogYnRjLWFwcC1zZXJ2ZXIgLS0gU2VydmVyIGZvciB0aGUgQmljeWNsZSBUb3VyaW5nIENvbXBhbmlvblxuICogQ29weXJpZ2h0IMKpIDIwMTYgQWR2ZW50dXJlIEN5Y2xpbmcgQXNzb2NpYXRpb25cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBidGMtYXBwLXNlcnZlci5cbiAqXG4gKiBidGMtYXBwLXNlcnZlciBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFmZmVybyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEZvb2Jhci4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgQWp2IGZyb20gJ2Fqdic7XG5pbXBvcnQgeyBhc3NpZ24sIG9taXQsIG1lcmdlLCB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5cbi8vICMgVmFsaWRhdGlvbiBNaXhpbiBGYWN0b3J5XG4vLyBBIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgbWl4aW4gdGhhdCBtYXkgYmUgYXBwbGllZCB0byBhIGJhY2tib25lIG1vZGVsLlxuLy8gVG8gZ2VuZXJhdGUgdGhlIG1peGluLCB5b3UgbXVzdCBzdXBwbHkgYSBjb25mb3JtYW50IEpTT04gc2NoZW1hIGFzIEpTT04uXG4vL1xuLy8gV2UgYXJlIHVzaW5nIFthanZdKGh0dHBzOi8vZ2l0aHViLmNvbS9lcG9iZXJlemtpbi9hanYpIHRvIHZhbGlkYXRlIG1vZGVscy5cbi8vIFNvbWUgbm90YWJsZSBjb25maWd1cmF0aW9uIHBpZWNlczpcbi8vICAtIGFsbEVycm9yczogcmVwb3J0IGFsbCBlcnJvcnMgZW5jb3VudGVyZWQgaW5zdGVhZCBvZiBmYWlsaW5nIGZhc3Rcbi8vICAtIHVzZURlZmF1bHRzOiBpZiBhIGRlZmF1bHQgaXMgcHJvdmlkZWQsIGluamVjdCB0aGF0IGludG8gdGhlIG1vZGVsXG4vL1xuLy8gVGhlIGFqdiBpbnN0YW5jZSB3aWxsIGJlIGNsb3NlZCBvdmVyIGJ5IHRoZSBgdmFsaWRhdGVgIGZ1bmN0aW9uIG1peGVkIGludG9cbi8vIHRoZSBiYWNrYm9uZSBtb2RlbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFZhbGlkYXRpb25NaXhpbiggc2NoZW1hICkge1xuICBjb25zdCBhanYgPSBBanYoIHtcbiAgICByZW1vdmVBZGRpdGlvbmFsOiB0cnVlLFxuICAgIGFsbEVycm9yczogdHJ1ZSxcbiAgICB1c2VEZWZhdWx0czogdHJ1ZVxuICB9ICk7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyAjIyBWYWxpZGF0ZVxuICAgIC8vIFZhbGlkYXRlIG1vZGVsIGF0dHJpYnV0ZXMgd2l0aCBhanYuIEV4Y2x1ZGUgc2FmZWd1YXJkZWQga2V5cyBiZWZvcmVcbiAgICAvLyB2YWxpZGF0aW9uIChzZWUgQ291Y2hNb2RlbCkuIFJldHVybnMgZWl0aGVyIGFuIGFycmF5IG9mIGVycm9ycyBvclxuICAgIC8vIHVuZGVmaW5lZC5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIGF0dHJpYnV0ZXMsIG9wdGlvbnMgKSB7XG4gICAgICBsZXQgYXR0cnM7XG4gICAgICBpZiAoIHRoaXMuc2FmZWd1YXJkICkge1xuICAgICAgICBhdHRycyA9IG9taXQoIGF0dHJpYnV0ZXMsIHRoaXMuc2FmZWd1YXJkICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IGF0dHJpYnV0ZXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbGlkID0gYWp2LnZhbGlkYXRlKCBzY2hlbWEsIGF0dHJzICk7XG4gICAgICBpZiAoICF2YWxpZCApIHtcbiAgICAgICAgcmV0dXJuIGFqdi5lcnJvcnM7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vLyAjIG1peGluVmFsaWRhdGlvblxuLy8gR2l2ZW4gYSBiYWNrYm9uZSBtb2RlbCBvciBjb2xsZWN0aW9uLCBtaXggaW4gdGhlIHZhbGlkYXRpb24gZnVuY3Rpb24sXG4vLyBwcmVwYXJlZCBmb3IgYSBKU09OIHNjaGVtYS4gVGhpcyBzY2hlbWEgbXVzdCBiZSBhdmFpbGFibGUgYXMgSlNPTlxuLy8gaW4gdGhlIG1vZGVsIG9yIGNvbGxlY3Rpb24ncyBwcm90b3R5cGUuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5WYWxpZGF0aW9uKCBtb2RlbFdpdGhTY2hlbWEgKSB7XG4gIGNvbnN0IG1peGluID0gVmFsaWRhdGlvbk1peGluKCBtb2RlbFdpdGhTY2hlbWEucHJvdG90eXBlLnNjaGVtYSApO1xuICBhc3NpZ24oIG1vZGVsV2l0aFNjaGVtYS5wcm90b3R5cGUsIG1peGluICk7XG59XG5cbi8vICMgbWVyZ2VTY2hlbWFzXG4vLyBJbiBpbmVyaXRhbmNlIGhpZXJhcmNoaWVzLCBKU09OIHNjaGVtYXMgbXVzdCBiZSBtZXJnZWQuXG4vLyBUaGlzIGZ1bmN0aW9uIG1lcmdlcyBzY2hlbWEgSlNPTiBqdXN0IGxpa2UgbG9kYXNoLm1lcmdlLCBleGNlcHQgd2UgdW5pb25cbi8vIGFycmF5cyB0b2dldGhlciAoZm9yIHVzZSB3aXRoIHRoZSBgcmVxdWlyZWRgIGZpZWxkIGZvciBpbnN0YW5jZSkuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTY2hlbWFzKCBwYXJlbnQsIG1pbmUgKSB7XG4gIGNvbnN0IGludGVybWVkaWF0ZSA9IG1lcmdlKCB7fSwgcGFyZW50LCBtaW5lICk7XG4gIGNvbnN0IHJlcXVpcmVkID0gdW5pb24oIHBhcmVudC5yZXF1aXJlZCwgbWluZS5yZXF1aXJlZCApO1xuXG4gIHJldHVybiBhc3NpZ24oIHt9LCBpbnRlcm1lZGlhdGUsIHsgcmVxdWlyZWQgfSApO1xufVxuIl19
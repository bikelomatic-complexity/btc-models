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
  var ajv = (0, _ajv2.default)({ allErrors: true, useDefaults: true });

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
function mergeSchemas() {
  for (var _len = arguments.length, schemas = Array(_len), _key = 0; _key < _len; _key++) {
    schemas[_key] = arguments[_key];
  }

  return _lodash.mergeWith.apply(null, [].concat(schemas, [unionCustomizer]));
}

// # unionCustomizer
// Lodash customizer for mergeSchemas
function unionCustomizer(objValue, srcValue) {
  if ((0, _lodash.isArray)(objValue)) {
    return objValue.concat(srcValue);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC92YWxpZGF0aW9uLW1peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlDd0IsZUFBZTtRQTRCdkIsZUFBZSxHQUFmLGVBQWU7UUFTZixZQUFZLEdBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXJDYixTQUFTLGVBQWUsQ0FBRSxNQUFNLEVBQUc7QUFDaEQsTUFBTSxHQUFHLEdBQUcsbUJBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBRSxDQUFDOztBQUUxRCxTQUFPOzs7OztBQUtMLFlBQVEsRUFBRSxrQkFBVSxVQUFVLEVBQUUsT0FBTyxFQUFHO0FBQ3hDLFVBQUksS0FBSyxZQUFBLENBQUM7QUFDVixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUc7QUFDcEIsYUFBSyxHQUFHLGtCQUFNLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFLENBQUM7T0FDNUMsTUFBTTtBQUNMLGFBQUssR0FBRyxVQUFVLENBQUM7T0FDcEI7O0FBRUQsVUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBRSxNQUFNLEVBQUUsS0FBSyxDQUFFLENBQUM7QUFDNUMsVUFBSyxDQUFDLEtBQUssRUFBRztBQUNaLGVBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztPQUNuQjtLQUNGO0dBQ0YsQ0FBQztDQUNIOzs7Ozs7QUFBQSxBQU1NLFNBQVMsZUFBZSxDQUFFLGVBQWUsRUFBRztBQUNqRCxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsQ0FBQztBQUNsRSxzQkFBUSxlQUFlLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBRSxDQUFDO0NBQzVDOzs7Ozs7QUFBQSxBQU1NLFNBQVMsWUFBWSxHQUFlO29DQUFWLE9BQU87QUFBUCxXQUFPOzs7QUFDdEMsU0FBTyxrQkFBVSxLQUFLLENBQUUsSUFBSSxZQUFPLE9BQU8sR0FBRSxlQUFlLEdBQUksQ0FBQztDQUNqRTs7OztBQUFBLEFBSUQsU0FBUyxlQUFlLENBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRztBQUM3QyxNQUFLLHFCQUFTLFFBQVEsQ0FBRSxFQUFHO0FBQ3pCLFdBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUUsQ0FBQztHQUNwQztDQUNGIiwiZmlsZSI6InZhbGlkYXRpb24tbWl4aW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBidGMtYXBwLXNlcnZlciAtLSBTZXJ2ZXIgZm9yIHRoZSBCaWN5Y2xlIFRvdXJpbmcgQ29tcGFuaW9uXG4gKiBDb3B5cmlnaHQgwqkgMjAxNiBBZHZlbnR1cmUgQ3ljbGluZyBBc3NvY2lhdGlvblxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGJ0Yy1hcHAtc2VydmVyLlxuICpcbiAqIGJ0Yy1hcHAtc2VydmVyIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQWZmZXJvIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogYnRjLWFwcC1zZXJ2ZXIgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBBZmZlcm8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRm9vYmFyLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBBanYgZnJvbSAnYWp2JztcbmltcG9ydCB7IGFzc2lnbiwgb21pdCwgaXNBcnJheSwgbWVyZ2VXaXRoIH0gZnJvbSAnbG9kYXNoJztcblxuLy8gIyBWYWxpZGF0aW9uIE1peGluIEZhY3Rvcnlcbi8vIEEgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBtaXhpbiB0aGF0IG1heSBiZSBhcHBsaWVkIHRvIGEgYmFja2JvbmUgbW9kZWwuXG4vLyBUbyBnZW5lcmF0ZSB0aGUgbWl4aW4sIHlvdSBtdXN0IHN1cHBseSBhIGNvbmZvcm1hbnQgSlNPTiBzY2hlbWEgYXMgSlNPTi5cbi8vXG4vLyBXZSBhcmUgdXNpbmcgW2Fqdl0oaHR0cHM6Ly9naXRodWIuY29tL2Vwb2JlcmV6a2luL2FqdikgdG8gdmFsaWRhdGUgbW9kZWxzLlxuLy8gU29tZSBub3RhYmxlIGNvbmZpZ3VyYXRpb24gcGllY2VzOlxuLy8gIC0gYWxsRXJyb3JzOiByZXBvcnQgYWxsIGVycm9ycyBlbmNvdW50ZXJlZCBpbnN0ZWFkIG9mIGZhaWxpbmcgZmFzdFxuLy8gIC0gdXNlRGVmYXVsdHM6IGlmIGEgZGVmYXVsdCBpcyBwcm92aWRlZCwgaW5qZWN0IHRoYXQgaW50byB0aGUgbW9kZWxcbi8vXG4vLyBUaGUgYWp2IGluc3RhbmNlIHdpbGwgYmUgY2xvc2VkIG92ZXIgYnkgdGhlIGB2YWxpZGF0ZWAgZnVuY3Rpb24gbWl4ZWQgaW50b1xuLy8gdGhlIGJhY2tib25lIG1vZGVsLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVmFsaWRhdGlvbk1peGluKCBzY2hlbWEgKSB7XG4gIGNvbnN0IGFqdiA9IEFqdiggeyBhbGxFcnJvcnM6IHRydWUsIHVzZURlZmF1bHRzOiB0cnVlIH0gKTtcblxuICByZXR1cm4ge1xuICAgIC8vICMjIFZhbGlkYXRlXG4gICAgLy8gVmFsaWRhdGUgbW9kZWwgYXR0cmlidXRlcyB3aXRoIGFqdi4gRXhjbHVkZSBzYWZlZ3VhcmRlZCBrZXlzIGJlZm9yZVxuICAgIC8vIHZhbGlkYXRpb24gKHNlZSBDb3VjaE1vZGVsKS4gUmV0dXJucyBlaXRoZXIgYW4gYXJyYXkgb2YgZXJyb3JzIG9yXG4gICAgLy8gdW5kZWZpbmVkLlxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggYXR0cmlidXRlcywgb3B0aW9ucyApIHtcbiAgICAgIGxldCBhdHRycztcbiAgICAgIGlmICggdGhpcy5zYWZlZ3VhcmQgKSB7XG4gICAgICAgIGF0dHJzID0gb21pdCggYXR0cmlidXRlcywgdGhpcy5zYWZlZ3VhcmQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0dHJzID0gYXR0cmlidXRlcztcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsaWQgPSBhanYudmFsaWRhdGUoIHNjaGVtYSwgYXR0cnMgKTtcbiAgICAgIGlmICggIXZhbGlkICkge1xuICAgICAgICByZXR1cm4gYWp2LmVycm9ycztcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vICMgbWl4aW5WYWxpZGF0aW9uXG4vLyBHaXZlbiBhIGJhY2tib25lIG1vZGVsIG9yIGNvbGxlY3Rpb24sIG1peCBpbiB0aGUgdmFsaWRhdGlvbiBmdW5jdGlvbixcbi8vIHByZXBhcmVkIGZvciBhIEpTT04gc2NoZW1hLiBUaGlzIHNjaGVtYSBtdXN0IGJlIGF2YWlsYWJsZSBhcyBKU09OXG4vLyBpbiB0aGUgbW9kZWwgb3IgY29sbGVjdGlvbidzIHByb3RvdHlwZS5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpblZhbGlkYXRpb24oIG1vZGVsV2l0aFNjaGVtYSApIHtcbiAgY29uc3QgbWl4aW4gPSBWYWxpZGF0aW9uTWl4aW4oIG1vZGVsV2l0aFNjaGVtYS5wcm90b3R5cGUuc2NoZW1hICk7XG4gIGFzc2lnbiggbW9kZWxXaXRoU2NoZW1hLnByb3RvdHlwZSwgbWl4aW4gKTtcbn1cblxuLy8gIyBtZXJnZVNjaGVtYXNcbi8vIEluIGluZXJpdGFuY2UgaGllcmFyY2hpZXMsIEpTT04gc2NoZW1hcyBtdXN0IGJlIG1lcmdlZC5cbi8vIFRoaXMgZnVuY3Rpb24gbWVyZ2VzIHNjaGVtYSBKU09OIGp1c3QgbGlrZSBsb2Rhc2gubWVyZ2UsIGV4Y2VwdCB3ZSB1bmlvblxuLy8gYXJyYXlzIHRvZ2V0aGVyIChmb3IgdXNlIHdpdGggdGhlIGByZXF1aXJlZGAgZmllbGQgZm9yIGluc3RhbmNlKS5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVNjaGVtYXMoIC4uLnNjaGVtYXMgKSB7XG4gIHJldHVybiBtZXJnZVdpdGguYXBwbHkoIG51bGwsIFsgLi4uc2NoZW1hcywgdW5pb25DdXN0b21pemVyIF0gKTtcbn1cblxuLy8gIyB1bmlvbkN1c3RvbWl6ZXJcbi8vIExvZGFzaCBjdXN0b21pemVyIGZvciBtZXJnZVNjaGVtYXNcbmZ1bmN0aW9uIHVuaW9uQ3VzdG9taXplciggb2JqVmFsdWUsIHNyY1ZhbHVlICkge1xuICBpZiAoIGlzQXJyYXkoIG9ialZhbHVlICkgKSB7XG4gICAgcmV0dXJuIG9ialZhbHVlLmNvbmNhdCggc3JjVmFsdWUgKTtcbiAgfVxufVxuIl19